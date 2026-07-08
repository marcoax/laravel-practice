<?php

// Router for `php -S localhost:8000 scripts/progress-server.php` (run from the
// repo root). Static files are served exactly as with plain `php -S`; the one
// extra route, POST /progress, lets the course page write lesson status into
// progress.json — the single store shared with the agent's lifecycle-gate
// writes ("one store, two writers", spec/ADR-0018). The note channel stays
// agent-only: this endpoint never touches an entry's `note`.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    return false; // fall through to the built-in static file server
}

header('Content-Type: application/json');

$remoteAddress = $_SERVER['REMOTE_ADDR'] ?? '';
$localAddresses = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

if (!in_array($remoteAddress, $localAddresses, true)) {
    http_response_code(403);
    echo json_encode(['error' => 'progress server is local-only; run it on localhost and do not expose it publicly']);
    exit;
}

if (parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) !== '/progress') {
    http_response_code(404);
    echo json_encode(['error' => 'unknown route — only POST /progress is handled']);
    exit;
}

$body = json_decode((string) file_get_contents('php://input'), true);
$key = is_array($body) ? ($body['key'] ?? null) : null;
$status = is_array($body) ? ($body['status'] ?? null) : null;

if (!is_string($key) || $key === '' || !in_array($status, ['todo', 'doing', 'done'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'expected {"key": "<non-empty string>", "status": "todo|doing|done"}']);
    exit;
}

$file = __DIR__ . '/../progress.json';
$data = is_file($file) ? json_decode((string) file_get_contents($file), true) : null;
if (!is_array($data) || !isset($data['progress']) || !is_array($data['progress'])) {
    $data = ['progress' => []]; // absent or invalid — start fresh
}

$entry = is_array($data['progress'][$key] ?? null) ? $data['progress'][$key] : [];
$entry['status'] = $status;
$data['progress'][$key] = $entry;

// Atomic write: temp file in the same directory, then rename() over the target,
// so the page's 4s poll never reads a half-written file.
$tmp = tempnam(dirname($file), 'progress-');
$json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
if ($tmp === false || file_put_contents($tmp, $json) === false || !rename($tmp, $file)) {
    if ($tmp !== false && is_file($tmp)) {
        unlink($tmp);
    }
    http_response_code(500);
    echo json_encode(['error' => 'could not write progress.json']);
    exit;
}

echo json_encode([$key => $entry]);
