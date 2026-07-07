"use strict";

var PROGRESS_POLL_MS = 4000;   // sidebar status + notes from progress.json (ADR-0004 channel)
var RELOAD_POLL_MS = 3000;     // active lesson content poll → auto-reload after agent edits

var courseBaselineMajor = 12;  // learning-config.md default; 12 preserves current behavior
var LESSONS = ALL_LESSONS.slice();
var RECAPS = ALL_RECAPS.slice();
var progress = {};             // { "<key>": {status, note} }
var active = null;             // slug of the open lesson
var noteOpen = false;          // note panel visibility (per open lesson)
var lastBody = null;           // snapshot of the open lesson's HTML
var wasMissing = false;        // lesson HTML 404'd — reload as soon as it appears

function lessonUrl(slug) { return "lessons/" + slug + ".html"; }
function lessonMdUrl(slug) { return "lessons/" + slug + ".md"; }
function statusOf(key) { return (progress[key] && progress[key].status) || "todo"; }
function noteOf(key) { return (progress[key] && progress[key].note) || ""; }
function pad2(n) { return (n < 10 ? "0" : "") + n; }
function findBySlug(slug) {
    return LESSONS.filter(function (x) { return x.slug === slug; })[0] ||
        RECAPS.filter(function (x) { return x.slug === slug; })[0];
}

function parseCourseBaseline(text) {
    var m = text.match(/^\s*course_baseline_major:\s*['"]?(12|13)['"]?\s*$/m);
    return m ? Number(m[1]) : 12;
}

function loadCourseBaseline() {
    return fetch("learning-config.md", { cache: "no-store" })
        .then(function (r) { if (!r.ok) throw 0; return r.text(); })
        .then(parseCourseBaseline)
        .catch(function () { return 12; });
}

function versionLineFromMarkdown(markdown) {
    var m = markdown.match(/^>\s*Version:\s*(.+)$/m);
    return m ? m[1] : "";
}

function lessonMajorFromVersion(versionText) {
    var versionSegment = versionText.split("·")[0];
    var majors = [];
    var re = /(?:^|[^\d.])(\d+)(?=\.(?:\d+|x)\b)/g;
    var m;
    while ((m = re.exec(versionSegment)) !== null) {
        majors.push(Number(m[1]));
    }
    if (!majors.length) return null;
    return Math.min.apply(Math, majors);
}

function loadLessonMetadata() {
    return Promise.all(ALL_LESSONS.map(function (l) {
        return fetch(lessonMdUrl(l.slug), { cache: "no-store" })
            .then(function (r) { if (!r.ok) throw 0; return r.text(); })
            .then(function (markdown) {
                l.versionText = versionLineFromMarkdown(markdown);
                l.major = lessonMajorFromVersion(l.versionText);
            })
            .catch(function () {
                l.versionText = "";
                l.major = null;
            });
    }));
}

function applyCourseFilters() {
    LESSONS = ALL_LESSONS.filter(function (l) {
        return l.major === null || l.major >= courseBaselineMajor;
    });
    RECAPS = ALL_RECAPS.filter(function (x) {
        return !(courseBaselineMajor >= 13 && x.slug === "recap-12x");
    });
}

function showEmpty(message) {
    active = null;
    document.getElementById("pane").style.display = "none";
    document.getElementById("empty").style.display = "";
    document.getElementById("empty").innerHTML = message;
    document.getElementById("paneTitle").textContent = "no lesson open";
    document.getElementById("paneLive").textContent = "";
    document.getElementById("statusErr").textContent = "";
    renderNav(); renderNote();
}

function renderProgressBar() {
    var done = LESSONS.filter(function (l) { return statusOf(l.key) === "done"; }).length;
    var pct = LESSONS.length ? Math.round(done / LESSONS.length * 100) : 0;
    document.getElementById("barFill").style.width = pct + "%";
    document.getElementById("progLabel").innerHTML = "<strong>" + done + "</strong> / " + LESSONS.length + " done";
    document.getElementById("progPct").textContent = pct + "%";
}

function renderNav() {
    var nav = document.getElementById("nav");
    nav.innerHTML = "";
    LESSONS.forEach(function (l, i) {
        var st = statusOf(l.key);
        var a = document.createElement("a");
        a.className = "item " + st + (active === l.slug ? " active" : "");
        a.href = "#" + l.slug;
        a.innerHTML = '<span class="dot ' + st + '"></span><span class="n">' + pad2(i + 1) + '</span>' +
            '<span class="t">' + l.title + (l.ver ? ' <span class="v">(' + l.ver + ')</span>' : '') + '</span>';
        nav.appendChild(a);
    });
    if (RECAPS.length) {
        var lbl = document.createElement("div");
        lbl.className = "sec-label";
        lbl.textContent = "recap";
        nav.appendChild(lbl);
        RECAPS.forEach(function (x) {
            var a = document.createElement("a");
            a.className = "item" + (active === x.slug ? " active" : "");
            a.href = "#" + x.slug;
            a.innerHTML = '<span class="dot"></span><span class="t">' + x.title + '</span>';
            nav.appendChild(a);
        });
    }
}

// Read-only note panel: notes remain agent-only (lesson lifecycle gate,
// ADR-0004); the page just displays what progress.json holds for the active
// lesson. Recaps have no key → no note, toggle hidden.
function renderNote() {
    var l = active ? findBySlug(active) : null;
    var note = (l && l.key) ? noteOf(l.key) : "";
    var btn = document.getElementById("noteToggle");
    var panel = document.getElementById("notePanel");
    btn.style.display = note ? "inline-block" : "none";
    btn.className = "note-toggle" + (noteOpen ? " on" : "");
    panel.className = "note-panel" + (note && noteOpen ? " open" : "");
    panel.textContent = note;
    renderStatusSeg();
}

// Manual status marking (ADR-0018): the segmented control shows only when the
// active item has a progress.json key (recaps don't, ADR-0014). Status writes
// go through POST /progress on scripts/progress-server.php — same store the
// agent writes at the gate, so the 4s poll re-syncs both directions.
function renderStatusSeg() {
    var l = active ? findBySlug(active) : null;
    var seg = document.getElementById("statusSeg");
    if (!(l && l.key)) { seg.style.display = "none"; return; }
    seg.style.display = "inline-block";
    var st = statusOf(l.key);
    var btns = seg.getElementsByTagName("button");
    for (var i = 0; i < btns.length; i++) {
        btns[i].className = btns[i].getAttribute("data-status") === st ? "on" : "";
    }
}

function setStatus(key, status) {
    var prev = statusOf(key);
    if (prev === status) return;
    if (!progress[key]) progress[key] = {};
    progress[key].status = status;                    // optimistic update
    document.getElementById("statusErr").textContent = "";
    renderProgressBar(); renderNav(); renderStatusSeg();
    fetch("progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key, status: status })
    })
        // Plain `php -S` answers unknown URIs with index.html and a 200, so a
        // status check alone can't detect the missing router — require a JSON body.
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .catch(function () {                              // revert: no write endpoint
            progress[key].status = prev;
            renderProgressBar(); renderNav(); renderStatusSeg();
            document.getElementById("statusErr").textContent =
                "⚠ no write endpoint — serve with scripts/progress-server.php";
        });
}

function showPane(slug) {
    document.getElementById("empty").style.display = "none";
    var pane = document.getElementById("pane");
    pane.style.display = "";
    pane.src = lessonUrl(slug);
}

// Not-yet-generated state (issue #58): lesson HTML is per-user and git-ignored,
// generated during a /teach session (recaps on first accept), so a fresh fork
// legitimately has no file yet. Keeps `active` set (selection stays highlighted,
// pollLessonFile keeps polling) unlike showEmpty(), which clears it.
function showNotGenerated(message) {
    document.getElementById("pane").style.display = "none";
    var empty = document.getElementById("empty");
    empty.style.display = "";
    empty.innerHTML = message;
}

function openLesson(slug) {
    var l = findBySlug(slug);
    if (!l) {
        showEmpty("This lesson is outside your active course path.");
        return;
    }
    active = slug;
    lastBody = null;
    wasMissing = false;
    noteOpen = false;
    document.getElementById("paneTitle").textContent = lessonUrl(slug) + " — " + l.title;
    document.getElementById("paneLive").textContent = "";
    document.getElementById("statusErr").textContent = "";
    renderNav(); renderNote();
    fetch(lessonUrl(slug), { cache: "no-store" })
        .then(function (r) { if (!r.ok) throw 0; return r.text(); })
        .then(function (body) {
            if (slug !== active) return; // navigated away while the check was in flight
            lastBody = body;
            showPane(slug);
        })
        .catch(function () {
            if (slug !== active) return;
            wasMissing = true; // pollLessonFile reloads the pane the moment it appears
            var isRecap = l.key === undefined;
            showNotGenerated(isRecap
                ? "This recap is created when you first accept adding a completed lesson to it."
                : "\"" + l.title + "\" hasn't been generated yet — run /lesson to generate it.");
        });
}

function onHash() {
    var slug = location.hash.replace(/^#/, "");
    if (slug && slug !== active) openLesson(slug);
}

// Sidebar status + notes: the agent-written progress.json (ADR-0004),
// re-polled so completion recorded at the gate shows up without a refresh.
function pollProgress() {
    fetch("progress.json", { cache: "no-store" })
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (data) {
            progress = (data && data.progress) ? data.progress : (data || {});
            renderProgressBar(); renderNav(); renderNote();
        })
        .catch(function () { /* no progress.json — everything stays todo */ });
}

// Live half of the deepen loop (ADR-0013): when the agent rewrites the open
// lesson file, the fetched content differs from the last snapshot and the
// iframe reloads. Content comparison, not Last-Modified: php -S sends no
// freshness headers for static files. A missing file (the HTML is generated
// mid-session by /teach) keeps polling and reloads on first appearance.
function reloadPane(slug) {
    document.getElementById("empty").style.display = "none";
    var pane = document.getElementById("pane");
    pane.style.display = "";
    pane.src = lessonUrl(slug) + "?t=" + Date.now();
    document.getElementById("paneLive").textContent = "↻ updated " + new Date().toLocaleTimeString();
    document.getElementById("paneLive").className = "live";
}
function pollLessonFile() {
    if (!active) return;
    var slug = active;
    fetch(lessonUrl(slug), { cache: "no-store" })
        .then(function (r) {
            if (!r.ok) { if (slug === active) wasMissing = true; return null; }
            return r.text();
        })
        .then(function (body) {
            if (body === null || slug !== active) return;
            if (wasMissing || (lastBody !== null && body !== lastBody)) reloadPane(slug);
            wasMissing = false;
            lastBody = body;
        })
        .catch(function () { /* transient — keep polling */ });
}

document.getElementById("noteToggle").onclick = function () {
    noteOpen = !noteOpen;
    renderNote();
};

document.getElementById("statusSeg").onclick = function (e) {
    var status = e.target.getAttribute && e.target.getAttribute("data-status");
    var l = active ? findBySlug(active) : null;
    if (status && l && l.key) setStatus(l.key, status);
};

window.addEventListener("hashchange", onHash);
function init() {
    Promise.all([loadCourseBaseline(), loadLessonMetadata()])
        .then(function (results) {
            courseBaselineMajor = results[0];
            applyCourseFilters();
            renderNav(); renderProgressBar(); renderNote();
            pollProgress(); onHash();
            setInterval(pollProgress, PROGRESS_POLL_MS);
            setInterval(pollLessonFile, RELOAD_POLL_MS);
        });
}

init();