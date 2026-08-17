# kodzero-schema-parser — agent working instructions

Trust these instructions. Only search the codebase if something here is incomplete or demonstrably wrong.

## What this repository is

`kodzero-schema-parser` is a small TypeScript **npm library** (published as ESM) that converts a
Kodzero table-field schema (`TableField<TableFieldAny>[]`) into a [`validno`](https://www.npmjs.com/package/validno)
validation schema. The public entry point is `KodzeroToValidnoParser.parseSchema(schemaDb, options?)`.

- Size: tiny (~40 source files, single package, no monorepo, no workspaces).
- Language/runtime: TypeScript 5.9 → ES2017 output, `"type": "module"` (ESM only), Node.js 22 validated (Node ≥ 18 types).
- Test framework: Jest 29 + ts-jest in ESM mode.
- No README, no CONTRIBUTING, no GitHub Actions / CI workflows, no lint config exist in this repo.

## Build, test, validate — exact commands

Always run from the repo root (`c:\Dev\_kodzero\lib-schema-parser` / repository root).

1. **Bootstrap (always first, on a clean checkout):**
   ```
   npm install
   ```
   Required before anything else; `dist/` and `node_modules/` are git-ignored.

2. **Build (type-check + emit to `dist/`):**
   ```
   npm run tsc          # = tsc -b src/
   ```
   - Validated: clean build after deleting `dist/` succeeds, exit code 0, no warnings.
   - `tsc -b` is incremental. `dist/tsconfig.tsbuildinfo` lives inside `dist/`, so deleting the whole
     `dist/` folder is a safe clean. If you delete only *some* emitted files and the build then skips
     emit, run `npx tsc -b src/ --force`.
   - Build output goes to `dist/` (`outDir: "../dist/"` relative to `src/tsconfig.json`).
   - Tests are **excluded** from the build (`exclude: ["**/__tests__/**", "**/*.test.ts"]`), so a
     passing `npm run tsc` does **not** type-check test files. Run the tests too.

3. **Test (main validation gate):**
   ```
   npm test             # node --experimental-vm-modules node_modules/jest/bin/jest.js
   npm run test:coverage
   ```
   - Validated: 11 suites / 141 tests pass in ~7 s (allow up to ~60 s cold).
   - Tests run directly on TypeScript sources via ts-jest; **no build is required before testing**.
   - `ExperimentalWarning: VM Modules is an experimental feature` is printed on every worker. This is
     expected and harmless — do not "fix" it; the `--experimental-vm-modules` flag is mandatory for ESM Jest.
   - Never invoke `npx jest` directly (it fails without the Node flag). Always use `npm test`.
   - Single file: `npm test -- src/__tests__/string.test.ts`.

4. **Lint:** there is **no working lint setup**. `eslint` is a devDependency but there is no
   `.eslintrc*` / `eslint.config.js`, and `npx eslint src` fails (exit 2). Do not add lint to your
   validation loop and do not add a lint config unless explicitly asked.

5. **Dev script:** `npm run dev` (`nodemon dist/dev.js`) requires a prior `npm run tsc` and depends on
   `src/dev.ts`, which is git-ignored scratch code. Do not rely on it for validation.

6. **Publish:** `npm run release:patch|minor|major|beta` → runs `prepublishOnly` (`npm run tsc`) then
   `npm publish`. Never run release/publish commands yourself.

**Recommended validation sequence before finishing any change: `npm install` (if needed) → `npm run tsc` → `npm test`.**

## Project layout

```
package.json            scripts, deps; "type": "module", main = dist/index.js
jest.config.js          ESM ts-jest preset, testMatch **/__tests__/**/*.test.ts
.gitignore              node_modules, dist, .env, .vscode, coverage, dev.ts
coverage/               generated, git-ignored
src/
  tsconfig.json         THE tsconfig (there is none in the repo root). strict: true,
                        target ES2017, module ES2022, moduleResolution node,
                        declaration + declarationMap, outDir ../dist/, excludes tests
  index.ts              default-exports KodzeroToValidnoParser only
  KodzeroToValidnoParser.ts   ~90% of the logic: static parseBoolean/parseDate/parseEmail/
                        parseFile/parseJson/parseMarkdown/parseNumber/parseRelation/
                        parseSelect/parseString/parseUrl + parseSchema dispatcher
  parsers-by-types/file-parser.ts   file field parser (extracted from the class)
  kz-schema-factory/
    types.ts            TableField, TableFieldAny, TableFieldItem, *Specs interfaces, AttachedFile
    types-constructors/ one class per field type (string, number, date, ... , autofield*)
    fields-to-types/    markdown/number/select/string/url helpers
  types/                attached-file.ts, table-fields.ts
  utils/                is-valid-json.ts, validate-input.ts, generate-secret.ts
  __tests__/            one *.test.ts per field type (boolean, date, email, file, json,
                        markdown, number, relation, select, string, url)
```

### Conventions that WILL break the build if ignored

- **All relative imports must end in `.js`** (ESM + `moduleResolution: node`), even when importing a
  `.ts` file: `import x from './utils/is-valid-json.js'`. Jest maps this back via `moduleNameMapper`.
- `strict: true` is on — no implicit `any`, null-checks enforced.
- Use `import type { ... }` for type-only imports (existing style).
- Adding a new field type requires touching, in this order:
  1. `src/kz-schema-factory/types.ts` (add `XxxSpecs`, add class to `TableFieldAny` union),
  2. `src/kz-schema-factory/types-constructors/xxx.ts` (constructor + `validno` specs schema + `validateInput`),
  3. a `parseXxx` static in `src/KodzeroToValidnoParser.ts` **and** a `case 'xxx':` in `parseSchema`,
  4. `src/__tests__/xxx.test.ts` mirroring the existing "build kodzero schema → expect equal validno schema" style.

### Non-obvious dependency

`src/KodzeroToValidnoParser.ts` imports `ObjectId` from **`bson`**, but `bson` is **not** a declared
dependency — it is only present transitively via the `mongodb` devDependency. Relation fields
(`relationAsObjectId: true`, the default) therefore depend on it. Do not remove `mongodb` from
devDependencies, and be aware consumers may need `bson`. Only change this if the task asks for it.

## Pre-check-in expectations

There is no CI pipeline, so the agent is the only gate. Before proposing changes:

1. `npm run tsc` must exit 0.
2. `npm test` must report all suites passing (currently 11 suites / 141 tests).
3. Do not commit `dist/` or `coverage/` (both git-ignored).
4. Do not bump the version in `package.json` unless asked; releases are manual via `npm run release:*`.
