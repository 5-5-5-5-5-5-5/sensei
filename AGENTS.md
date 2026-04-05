**Setup & Build**
- Run `npm install` then `npm run build` before invoking the CLI.
- Use `node dist/bin/index.js --help` for global usage or `sensei <cmd> --help` after linking.

**CLI Commands**
- Core commands: `diagnosticar`, `guardian`, `formatar`, `podar`, `reestruturar`, `fix-types`.
- Most commands accept `--json` for CI integration and `--export` to write reports.
- Helpful flags: `--full`, `--compact`, `--include`, `--exclude`, `--exclude-tests`.

**Running Tests**
- Execute the test suite with `npm run test`.
- To run a single test file: `npm run test -- <path/to/file.test.ts>`.

**Lint & Typecheck**
- Run `npm run lint` then `npm run typecheck` before committing.
- Pre‑commit hooks enforce lint and typecheck; ensure they pass.

**Development Workflow**
1. `npm install && npm run build`
2. Make changes in `src/`.
3. Run `npm run lint && npm run typecheck && npm run test`.
4. Use `sensei diagnosticar --full` to verify overall health.
5. Commit; CI will run the same scripts.

**Project Structure**
- Entry point: `src/bin/cli.ts`.
- Commands live under `src/cli/commands`.
- Core utilities in `src/core`.
- Analistas (detectors/fixes) in `src/analistas`.
- Guardian integrity logic in `src/guardian`.
- Reports generated in `src/relatorios`.

**Configuration**
- Main config file: `sensei.config.json`.
- Key blocks: `INCLUDE_EXCLUDE_RULES`, `REPO_ARQUETIPO`, `REPORT_EXPORT_ENABLED`.
- Adjust `globalExcludeGlob` to skip `node_modules`, `dist`, `coverage`.

**CI Expectations**
- CI runs `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`.
- `sensei diagnosticar --json --export` is used for audit reports.

**Common Gotchas**
- Ensure Node.js ≥ 24.14.0.
- After `npm run build`, the compiled CLI is at `dist/bin/index.js`.
- Pre‑commit hooks may reject commits with lint/type errors.
- Use `sensei <cmd> --help` for command‑specific options.
