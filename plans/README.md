# Plans

Working plans for the `9.0.0` cycle. Plans 1, 2 and 3 are executed in order; each one assumes the previous one is merged. Plan 4 runs alongside Plan 2 and must be complete before Plan 3.

| # | Plan | Purpose | Size |
|---|---|---|---|
| 1 | [Unit test coverage](./01-unit-tests.md) | Cover every package under `packages/` with deterministic unit tests run by `@rockpack/tester`, enforce 80-90% coverage. | XL |
| 2 | [Audit recommendations](./02-recommendations.md) | Close the findings of the 2026-09-23 audit: CI, hooks, publishing, root scripts, dependency hygiene, engines, bugs, error handling, lint rules, duplicated code, test-suite fixes outside `packages/`. | L |
| 3 | [Code improvements](./03-code-improvements.md) | Architecture, public API, performance and TypeScript coverage improvements on top of the test safety net. | XL |
| 4 | [End-to-end tests](./04-e2e.md) | E2E for the compiler and the starter (key modules) and for the published tarballs, in `pinned` and `latest` dependency modes, plus a nightly dependency canary. Runs alongside Plan 2 and before Plan 3. | L |
| 5 | [Remove the bundle analyzer](./05-remove-analyzer.md) | Drop the `analyzer` option, the `--analyzer` flag, webpack-bundle-analyzer and Statoscope from the compiler and the starter; users add an analyzer through the compiler callback. | S |

Conventions used in the plans:

- Checkboxes are the unit of work; check them off in the plan when merged.
- Sizes: S (hours), M (a day or two), L (a week), XL (several weeks).
- "Acceptance" sections are the definition of done for the plan; "Exit" lines inside a phase are the definition of done for that phase.
- Test structure, typing and diff rules from `CLAUDE.md` apply to all work.
