# Plan 6: Build reporter with a progress bar

Status: done 2026-09-25 (D1 to D4 as recommended)
Order: after Plan 5 (the analyzer removal takes the analyzer plugins and their messages out of the output first)
Owner: TBD

## 1. Goal

One Rockpack reporter replaces today's scattered compiler output. It shows a compact progress bar per compiler (two rows in an `isomorphicCompiler` build: client and server), a one-line summary per compiler when it finishes, and every kind of error and warning in one consistent, readable format. It works the same in a terminal, in CI logs and in the e2e suites.

Third-party progress plugins (webpackbar, progress-bar-webpack-plugin and similar) were tried and behaved badly with the isomorphic build: two compilers fighting over one line, bars left behind by nodemon and server logs, errors hidden or printed twice. The reporter is therefore written in the compiler and knows about Rockpack's own structure (compile context, client/server pair, dev server, nodemon, type checker, linters).

## 2. Non-goals

- No new visual dependency (no `cli-progress`, `ora`, `listr`, `log-update`): the renderer is a small module on top of `ansi-colors` (already a dependency) and ANSI cursor codes, so its behaviour with two compilers is fully ours.
- No change to what is built: bundles, stats objects and the `CompilerResult` API stay as they are.
- No logging API for users beyond the options in section 5; the callback can still add or remove webpack plugins.
- The starter's own CLI output (ora spinner in `install`) is out of scope.

## 3. What prints today

| Source | Where | What the user sees |
|---|---|---|
| `@nuxt/friendly-errors-webpack-plugin` | `modules/plugins/checks.ts`, one instance per compiler | "DONE Compiled successfully" plus `conf.messages` after every build, its own error formatting; in an isomorphic build two instances print two blocks per rebuild |
| `conf.messages` | `core/dev-server.ts` (`=> Starting server on <url>`, an empty line), `plugins/development.ts` (`nodemon is running`, `node-inspect is available on <port> port`) | Printed by friendly-errors as its success info, again after every rebuild |
| `log()` | `utils/log.ts`, called from `core/run.ts` after a production build | `[COMPILE] 0:3 minutes`, `Compiled successfully!` or `Failed to compile.` plus the errors formatted by `webpack-format-messages` |
| `logError()` | `utils/log.ts`, `error-handler.ts`, the compilers | `[rockpack] INVALID_CONFIG: ...` for invalid options and other `RockpackError`s |
| `fork-ts-checker-webpack-plugin` | `checks.ts` | In production its issues become compilation errors; in development it reports asynchronously with its own logger after the build is done |
| ESLint / Stylelint plugins | `checks.ts` (`lint: true`) | Their formatter output inside webpack errors or warnings |
| webpack-dev-server | `core/dev-server.ts`, `infrastructureLogging: error` | Mostly silent; errors in its own format |
| nodemon and the server process | `plugins/development.ts`, `plugins/ssr-development` | Server stdout/stderr, restart lines, interleaved with the compiler output |
| `mergeConfWithDefault` | `The distribution folder will be ...` | One line per compiler on start |
| webpack stats | `make-stats.ts`: `errors-only` (`errorDetails` in debug) | Not printed directly; feeds the formatters above |

Consumers that parse this output and must be updated in the same commit as the change: `e2e/compiler-e2e/src/dev.spec.ts` (`Starting server on <url>`, `node-inspect is available on <port> port`, `nodemon is running`, `listening on`), `e2e/starter-e2e/src/runtime.spec.ts` (`Starting server on <url>`), the compiler-e2e specs that match error texts (`no-var`, `color-named`, `TS2339`, `missing.tsx`, `[rockpack] INVALID_CONFIG`), and the compiler unit specs of `log`, `checks` and `development`.

## 4. Design

### 4.1 Structure

New folder `packages/compiler/src/reporter/`, one module each:

| Module | Responsibility |
|---|---|
| `reporter.ts` | `createReporter({ stream, mode, env })`: the state of every compiler (name, phase, percent, current step, start time, last result, errors, warnings, info lines) and the only writer to the terminal. One reporter per compile context, so the client and the server of an isomorphic build share it. |
| `reporter-plugin.ts` | A webpack plugin applied to each compiler: `ProgressPlugin` handler for percent and step, `watchRun` (changed files), `invalid`, `done` (stats), `failed`, plus the fork-ts-checker issues hook. It only sends events to the reporter. |
| `renderer.ts` | Draws the live area in a TTY: one row per compiler, redrawn in place with cursor-up and clear-line codes, throttled (about 10 frames per second), hidden when idle so later logs (nodemon, the server) never mix with a bar. Knows the terminal width (`stream.columns`, resize event) and truncates rows. |
| `format-errors.ts` | Turns webpack stats errors and warnings into the unified entries of 4.4 (kind, file, line, column, message, short code frame), de-duplicated across compilers. Replaces `webpack-format-messages`. |
| `summary.ts` | The one-line result per compiler and the info lines (4.3). |

`log.ts`, `FriendlyErrorsWebpackPlugin`, `webpack-format-messages` and `conf.messages` go; `logError` becomes the reporter's `error()` for `RockpackError`s so options errors look like build errors.

### 4.2 Modes

| Mode | When | Output |
|---|---|---|
| Interactive | `stream.isTTY` and not `CI` | Live bars, summaries, errors |
| Plain | Not a TTY, or `CI` set (GitHub Actions, the e2e suites) | No cursor movement and no redraws: one "started" line per compiler, then the same summary, info and error lines as interactive mode. Stable text for logs and tests. |
| Colour | Follows `ansi-colors` support: off with `NO_COLOR` or `FORCE_COLOR=0`, on with `FORCE_COLOR` | Independent of the mode |

### 4.3 What a user sees

Interactive, isomorphic development build while compiling:

```
 client  ██████████████░░░░░░  71%  building  src/pages/home.tsx
 server  ████████████████████ 100%  done
```

After it finishes (the bars are replaced by the summary):

```
 ✔ client  built in 2.4s   http://localhost:3000
 ✔ server  built in 1.1s   nodemon running, inspector on 9229
```

A rebuild after a file change:

```
 ↻ client  src/app.tsx changed
 ✔ client  built in 0.3s
```

Production:

```
 ✔ client  built in 8.2s   dist/  1.2 MB (340 kB gzip), 3 warnings
```

Rules: one line per compiler per build; the URL, nodemon and inspector facts become info on that line instead of separate messages; durations in seconds with one decimal; sizes only in production; the line is the same in plain mode except for the bar.

### 4.4 Errors and warnings

Every problem is printed as one entry, grouped by compiler, errors before warnings, in the order they occur:

```
 ✖ client  2 errors

   TypeScript  src/app.tsx:12:5  TS2339: Property 'title' does not exist on type 'Props'.
     11 |   return (
   > 12 |     <h1>{props.title}</h1>
        |     ^
   ESLint      src/util.ts:3:1   no-var: Unexpected var, use let or const instead.
```

Kinds and their sources:

| Kind | Source |
|---|---|
| Syntax | Babel loader errors (file, line, column, frame from the loader message) |
| Module not found | webpack `ModuleNotFoundError` (the request and the importing file) |
| TypeScript | fork-ts-checker issues (in development through its hooks, so they appear after the summary without a second format) |
| ESLint, Stylelint | the linter plugins' errors and warnings (with `lint: true`), one entry per problem |
| CSS / assets | css-loader, sass, postcss and asset errors |
| Configuration | `RockpackError` (`INVALID_CONFIG`, `INVALID_ENTRY`, `BUILD_FAILED`, `DTS_FAILED`) |
| Runtime | an uncaught error in the build script (error boundary) or a crash of the server under nodemon (its stderr stays visible, marked with the compiler name) |
| Warnings | size limits, webpack warnings, linter warnings: counted in the summary line; listed in full with `debug: true` or when there are no errors, collapsed to a count otherwise |

Duplicates (the same file and message from the client and the server compilers) are printed once with both names.

### 4.5 Interaction with the rest of Rockpack

- **Compile context:** the reporter lives in `CompileContext`, so a standalone compiler gets its own and `isomorphicCompiler` passes one to both configs; the legacy isomorphic form uses the legacy context as today.
- **Compiler names:** `client` and `server` for an isomorphic build, otherwise `frontend`, `backend`, `library` (from `compilerName`), overridable with `name`.
- **Dev server and nodemon:** they report facts (URL, inspector port, restarts) as reporter info instead of printing; their own logging stays off; the server program's own output is passed through untouched after the live area is cleared.
- **`CompilerResult`:** unchanged; `stats`, `success`, `url` keep working for scripts that read them.
- **Exit codes:** unchanged (`1` on errors, `130`/`143` on signals).

## 5. Decisions to confirm

- **D1. Own renderer, no dependency.** Recommended (section 2). Alternative: `log-update` for the live area only.
- **D2. Options.** Recommended: one option `progress?: boolean` (default `true`; `false` keeps summaries and errors but draws no bar, for terminals that handle redraws badly) and automatic plain mode in CI/non-TTY. Alternative: a `logLevel: 'silent' | 'errors' | 'normal' | 'verbose'` option as well.
- **D3. Warnings.** Recommended as in 4.4 (listed when there are no errors or with `debug`, otherwise counted). Alternative: always list them.
- **D4. Stable plain-mode lines for tools.** Recommended: keep `Starting server on <url>` as the plain-mode info text of the dev server (the starter runtime suite and users' scripts may read it) and document the summary line format in the README as stable. Alternative: a new format and updated tests only.

## 6. Steps

Each step is one or more commits with unit tests (fake TTY and non-TTY streams, fixed clock), goldens where output is compared, and the full verification before push.

- [x] **P1. Reporter core.** `reporter.ts`, `summary.ts`, `format-errors.ts` with unit tests: state transitions, one line per build, de-duplication, error kinds from recorded webpack stats fixtures (syntax, module not found, TypeScript, ESLint, Stylelint, CSS), warnings policy (D3), plain vs interactive text. _Done 2026-09-25: `format-errors.ts` (problem kinds from messages recorded on real builds: Babel syntax, missing module, TypeScript, CSS with the mini-css-extract wrapper dropped, ESLint, Stylelint; stack frames, colours and the root path removed, twelve lines at most, de-duplication), `summary.ts` (row, started, changed, summary, problem and info lines), `reporter.ts` (state per compiler, info lines after the first successful build, warnings per D3, late TypeScript block, throttled redraw, plain mode for non-TTY/CI/`progress: false`, colours by TTY, `NO_COLOR`, `FORCE_COLOR`). Deviation from 4.3: the info facts (URL, nodemon, inspector) are printed as indented lines under the first successful summary instead of on it, which keeps `Starting server on <url>` (D4) and the other texts as they were._
- [x] **P2. Renderer.** `renderer.ts`: two-row live area, throttling, width truncation, resize, clearing before other output, no escape codes in plain mode, `NO_COLOR`. Unit tests with a fake stream that records writes. _Done 2026-09-25: `renderer.ts` with a fake-stream spec (in-place redraw, print above the live area, width cut ignoring colour codes, clear, no escape codes in plain mode)._
- [x] **P3. Plugin and wiring.** `reporter-plugin.ts` on every compiler; reporter in `CompileContext`; `isomorphicCompiler` shares one; dev server, nodemon and the inspector report info; `RockpackError`s go through the reporter. Remove `FriendlyErrorsWebpackPlugin`, `webpack-format-messages`, `log.ts` and `conf.messages`; `lint:deps` clean. _Done 2026-09-25: `ReporterPlugin` (run, watchRun with the changed files, done, failed; `ProgressPlugin` only when bars are drawn) is added by `makeReportPlugins` for the context's reporter; `compile` creates a reporter per standalone build (`debug`, `progress`), `isomorphicCompiler` one for both halves; the dev server and nodemon report their facts as info; `RockpackError`s keep their `[rockpack] CODE: message` line. `FriendlyErrorsWebpackPlugin`, `webpack-format-messages`, `log()` and `conf.messages` are gone. `run` still prints an error when webpack returns no compiler at all (a plugin threw during setup, e.g. dotenv safe mode), because the reporter's hooks were never attached._
- [x] **P4. TypeScript and linters.** fork-ts-checker issues through its hooks (async in development, part of the build in production); ESLint and Stylelint entries parsed from their plugin errors; unit tests with recorded issues. _Done 2026-09-25: fork-ts-checker runs with a silent logger; in development its error issues go to `reporter.issues` through its `issues` hook, in production they arrive as build errors; ESLint (`failOnError` ends the build through the `failed` hook) and Stylelint reports become one entry each._
- [x] **P5. Option and docs (D2, D4).** `progress` option (validated, typed, in the README table), README section "Build output" with the interactive, plain and error examples, CHANGELOG (Changed: new output; Removed: friendly-errors, webpack-format-messages), MIGRATION note for scripts that parsed the old lines (`Compiled successfully!`, `[COMPILE]`, `DONE`). _Done 2026-09-25: `progress` is typed, validated and in the README table (P3); README "Build output" section, CHANGELOG (Added, Breaking), MIGRATION note. Deviation: no gzip size in the production line, only the emitted size (gzip would compress every asset once more per build)._
- [x] **P6. e2e.** Update the dev and runtime specs to the new lines; add an output spec in compiler-e2e (plain mode, because e2e runs without a TTY): a frontend build summary, an isomorphic dev build with both rows and the URL, one fixture per error kind of 4.4 asserting the entry format, warnings count, no escape codes in plain output. Starter quality and runtime suites stay green. _Done 2026-09-25: `output.spec.ts` in compiler-e2e (plain mode): summary line with size and no cursor codes or trailing spaces, Syntax, Module not found, TypeScript (once), CSS (without the wrapper); ESLint and Stylelint stay in `lint.spec.ts`; `dev.spec.ts` checks the `client` and `server` lines of the isomorphic build and still reads `Starting server on`, nodemon and inspector lines. Warnings are covered by the unit specs only (no fixture produces them cheaply)._
- [x] **P7. Manual TTY check.** Record the interactive output of `examples/compiler/isomorphic` in a real terminal (dev start, a rebuild, a TypeScript error, a server crash) and keep the transcript in the PR description; the TTY renderer itself is covered by P2 unit tests because the e2e processes have no TTY. _Done 2026-09-25 with macOS `script` as the pseudo-terminal on `examples/compiler/isomorphic`: production shows the client and server rows redrawn in place, then one summary each; development prints both summaries, the nodemon info, the server's own output untouched, and after an edit of `src/app.tsx` one `↻` line and one summary per compiler; no process was left behind. Two fixes came out of it: a pseudo-terminal reporting 0 columns is treated as 80, and a rebuild that repeats the same warnings only counts them (the express `Critical dependency` warning was listed after every rebuild). Still printed outside the reporter: `The distribution folder will be ...` (before any compiler exists) and the per-file library build lines of `sourceCompiler`._

## 7. Risks

- **Interleaving with server output:** nodemon and the server write whenever they want. The live area is only drawn while a compiler is building and is cleared before the reporter writes anything else; server output is never captured or re-printed, only passed through, so it cannot be lost.
- **Two compilers in one MultiCompiler:** webpack runs them in parallel with separate `ProgressPlugin` handlers; the reporter keeps a row per compiler and redraws both, so neither overwrites the other.
- **fork-ts-checker in development** reports after `done`; its entries are printed as a follow-up block for that compiler, not merged into an already printed summary.
- **Terminals without cursor support** (some Windows shells, piped output): detected as non-TTY, or disabled with `progress: false`.
- **Behaviour change for tools parsing the output:** covered by D4 and the MIGRATION note.

## 8. Acceptance

1. An isomorphic development build in a terminal shows two bars that never overwrite each other, then one summary line per compiler; a rebuild prints one line per changed compiler.
2. Every kind in 4.4 appears in the unified format in both modes, once per problem, with file, position and message; warnings follow D3.
3. Non-TTY and CI output contains no escape codes for cursor movement and is identical between runs apart from durations and sizes.
4. `@nuxt/friendly-errors-webpack-plugin` and `webpack-format-messages` are gone from the compiler dependencies; no module prints outside the reporter except the server program under nodemon.
5. Unit coverage thresholds hold; compiler-e2e has the output spec; all suites and CI are green.

Status 2026-09-25: 1, 2, 3 and 5 met (1 checked by hand in a pseudo-terminal, P7). 4 partly: friendly-errors and webpack-format-messages are gone and every build line comes from the reporter, but two older lines remain outside it: `The distribution folder will be ...` (printed while the options are merged, before a reporter exists) and the per-file progress lines of `sourceCompiler`/`libraryCompiler` formats. Moving them is a follow-up, not needed for the bars.

## 9. Order and size

| Step | Items | Size |
|---|---|---|
| 1 | Confirm D1 to D4 | - |
| 2 | P1, P2 | M |
| 3 | P3, P4 | M |
| 4 | P5, P6, P7 | M |
