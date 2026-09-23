# Plans

Working plans for the `9.0.0` cycle. They are executed in order; each one assumes the previous one is merged.

| # | Plan | Purpose | Size |
|---|---|---|---|
| 1 | [Unit test coverage](./01-unit-tests.md) | Cover every package under `packages/` with deterministic unit tests run by `@rockpack/tester`, enforce 80-90% coverage. | XL |
| 2 | [Audit recommendations](./02-recommendations.md) | Close the findings of the 2026-09-23 audit: CI, hooks, publishing, root scripts, dependency hygiene, engines, bugs, error handling, lint rules, duplicated code, test-suite fixes outside `packages/`. | L |
| 3 | [Code improvements](./03-code-improvements.md) | Architecture, public API, performance and TypeScript coverage improvements on top of the test safety net. | XL |

Conventions used in the plans:

- Checkboxes are the unit of work; check them off in the plan when merged.
- Sizes: S (hours), M (a day or two), L (a week), XL (several weeks).
- "Acceptance" sections are the definition of done for the plan; "Exit" lines inside a phase are the definition of done for that phase.
- Test structure, typing and diff rules from `CLAUDE.md` apply to all work.
