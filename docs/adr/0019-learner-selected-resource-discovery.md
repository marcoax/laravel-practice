# ADR-0019 — Learner-selected resource discovery

**Status:** Accepted (2026-07-03). Spec:
`specs/learner-selected-resource-discovery.html`. Source issue:
<https://github.com/marcoax/laravel-practice/issues/29>.

At the end of each lesson, the learner is offered an opt-in resource discovery step:
the agent can search the web and YouTube for very authoritative deeper resources and
attach the accepted links both to the lesson HTML and to `RESOURCES.md`. The learner
chooses whether to run the step; the agent does not autonomously decide that a lesson
is "high-value" enough to trigger it.

We chose this over an agent-scored "high-value lesson" trigger because the cost of a
false positive is lesson-end noise, while the cost of a false negative is hiding a useful
learning tool. A predictable end-of-lesson choice keeps the learner in control. Accepted
resources are capped at four per lesson and must be very high-authority: official or
primary sources first, then only clearly recognized Laravel/PHP authors, maintainers,
conference talks, or first-party ecosystem channels. Generic SEO content, shallow
YouTube videos, and undated API material are rejected.

Consequences: `RESOURCES.md` becomes a per-user `/teach` workspace index, not a bare
link dump, and is ignored by git. If no source clears the authority bar, the agent
reports that in chat and leaves files untouched. The existing single primary-source
callout remains part of normal lesson generation; learner-selected resource discovery is
an optional extension layered on top.
