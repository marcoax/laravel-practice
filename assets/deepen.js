/* Click-to-deepen widget — ADR-0013: prompt-prefill deepen channel.
   Declarative usage at the bottom of a lesson:

     <div class="deepen"
          data-msg-copied="…" data-msg-manual="…">
       <p class="deepen-lead">Approfondisci questo tema:</p>
       <button type="button" class="deepen-btn"
               data-prompt="Approfondisci nella lezione lessons/….html il tema: …">
         Label
       </button>
       …more buttons…
     </div>

   Clicking a button copies its full data-prompt to the clipboard and shows
   it in a visible box as a manual-copy fallback; the learner pastes it into
   the running Claude Code session, the agent patches the lesson HTML, and
   the course page (index.html, ADR-0015) reloads the page via content polling.

   The data-msg-* attributes localize the feedback (lessons follow the
   learner's language.chat); omitted, they fall back to English.

   No dialogs, no build step; hidden in print. */

(function () {
  "use strict";

  function messages(container) {
    return {
      copied: container.dataset.msgCopied ||
        "Copied — paste it into your Claude Code session.",
      manual: container.dataset.msgManual ||
        "Copy the prompt below and paste it into your Claude Code session."
    };
  }

  /**
   * Show the prompt in a visible box under the buttons and try to put it on
   * the clipboard. The box always appears: it doubles as confirmation of
   * what was copied and as the fallback when the Clipboard API is
   * unavailable (e.g. file:// in some browsers).
   */
  function present(container, prompt) {
    var msgs = messages(container);
    var box = container.querySelector(".deepen-prompt");
    if (!box) {
      box = document.createElement("pre");
      box.className = "deepen-prompt";
      container.appendChild(box);
    }
    var status = container.querySelector(".deepen-status");
    if (!status) {
      status = document.createElement("p");
      status.className = "deepen-status";
      status.setAttribute("role", "status");
      container.insertBefore(status, box);
    }
    box.textContent = prompt;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(prompt).then(
        function () { status.textContent = msgs.copied; },
        function () { status.textContent = msgs.manual; }
      );
    } else {
      status.textContent = msgs.manual;
    }
  }

  document.querySelectorAll(".deepen").forEach(function (container) {
    container.querySelectorAll(".deepen-btn").forEach(function (button) {
      if (!button.dataset.prompt) {
        console.warn("deepen: missing data-prompt", button);
        return;
      }
      button.addEventListener("click", function () {
        present(container, button.dataset.prompt);
      });
    });
  });
})();
