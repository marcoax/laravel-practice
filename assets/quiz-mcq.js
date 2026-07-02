/* MCQ quiz widget — ADR-0012: used only on discrimination beats.
   Declarative usage in a lesson:

     <fieldset class="mcq" data-answer="b"
               data-msg-none="…" data-msg-right="…" data-msg-wrong="…">
       <legend>Question…</legend>
       <label><input type="radio" name="q1" value="a"> option A</label>
       <label><input type="radio" name="q1" value="b"> option B</label>
       <button type="button" class="mcq-check">Check</button>
       <p class="mcq-feedback" role="status"></p>
     </fieldset>

   The data-msg-* attributes localize the feedback (lessons follow the
   learner's language.chat); omitted, they fall back to English.
   Each fieldset must use its own radio name (q1, q2, …) — radios sharing
   a name form a single group across the whole page.

   No dialogs, no build step; degrades to a paper drill in print. */

(function () {
  "use strict";

  function selectedValue(fieldset) {
    var checked = fieldset.querySelector('input[type="radio"]:checked');
    return checked ? checked.value : null;
  }

  /**
   * Render the outcome of a check: a wrong answer invites a retry without
   * revealing the solution (desirable difficulty); a correct answer locks
   * the radio inputs.
   *
   * @param {HTMLFieldSetElement} fieldset - the .mcq block
   * @param {HTMLElement} feedback - the .mcq-feedback element to write into
   * @param {string|null} selected - value of the chosen option, or null if none
   * @param {string} correct - the right value from data-answer
   */
  function messages(fieldset) {
    return {
      none: fieldset.dataset.msgNone || "Pick an answer before checking.",
      right: fieldset.dataset.msgRight || "Correct.",
      wrong: fieldset.dataset.msgWrong || "Not quite — try again: what separates the two?"
    };
  }

  function renderFeedback(fieldset, feedback, selected, correct) {
    var msgs = messages(fieldset);
    feedback.classList.remove("is-correct", "is-wrong");
    if (selected === null) {
      feedback.textContent = msgs.none;
      return;
    }
    if (selected === correct) {
      feedback.classList.add("is-correct");
      feedback.textContent = msgs.right;
      fieldset.querySelectorAll('input[type="radio"]').forEach(function (input) {
        input.disabled = true;
      });
    } else {
      feedback.classList.add("is-wrong");
      feedback.textContent = msgs.wrong;
    }
  }

  document.querySelectorAll(".mcq").forEach(function (fieldset) {
    var button = fieldset.querySelector(".mcq-check");
    var feedback = fieldset.querySelector(".mcq-feedback");
    if (!button || !feedback) return;
    if (!fieldset.dataset.answer) {
      console.warn("mcq: missing data-answer", fieldset);
      return;
    }
    button.addEventListener("click", function () {
      renderFeedback(fieldset, feedback, selectedValue(fieldset), fieldset.dataset.answer);
    });
  });
})();
