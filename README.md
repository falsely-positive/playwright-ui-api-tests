# Playwright UI and API tests

Automated tests written in [Playwright](https://playwright.dev/) with TypeScript, covering:

- **UI:** the [OrangeHRM](https://opensource-demo.orangehrmlive.com/) login page, run in desktop and mobile browsers.
- **API:** the `POST /pet` endpoint of the [Swagger Petstore](https://petstore.swagger.io/).

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later (the current LTS version is recommended)
- npm, which is installed with Node.js
- Git

## Installation

1. Clone the repository and go into its folder:

   ```bash
   git clone https://github.com/falsely-positive/playwright-ui-api-tests.git
   cd playwright-ui-api-tests
   ```

2. Install the dependencies:

   ```bash
   npm ci
   ```

3. Install the browsers Playwright uses (Chromium, Firefox and WebKit):

   ```bash
   npx playwright install --with-deps
   ```

   The API tests don't need a browser. If you only want to run those, you can skip this step.

4. Create your `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

   `.env.example` already contains the public credentials for the OrangeHRM demo site, so no changes are needed to run against the demo. `.env` is ignored by Git and should never be committed.

## Configuration

Settings are read from `.env`. Any of them can also be set on the command line, which overrides the file.

| Variable | Purpose | Default |
|---|---|---|
| `ENV` | Which environment to test: `preprod` (the public demo sites) or `local` | `preprod` |
| `ADMIN_USER` | OrangeHRM username for the login tests | Required |
| `ADMIN_PASSWORD` | OrangeHRM password for the login tests | Required |

The URLs for each environment are defined in [`environments.ts`](environments.ts).

## Running the tests

| Command | Runs |
|---|---|
| `npm test` | All tests |
| `npm run test:api` | API tests only |
| `npm run test:ui` | UI tests only, in all browsers |

The UI tests run in five browser projects: `chromium`, `firefox`, `webkit`, `Mobile Chrome` and `Mobile Safari`.

To narrow a run, add Playwright options after `--`:

```bash
npm run test:ui -- --project=chromium       # UI tests in Chromium only
npm run test:api -- -g "malformed JSON"     # tests whose name matches
```

To test a different environment:

```bash
ENV=local npm run test:ui
```

On Windows, setting a variable this way only works in Git Bash or WSL. In PowerShell, use `$env:ENV="local"; npm run test:ui`.

## Viewing the results

Results are printed to the terminal as the tests run, and an HTML report is written to `playwright-report/`. To open it:

```bash
npx playwright show-report
```

When a test fails, a screenshot and a trace are attached to it in the report. The trace shows each step, the page at that point, network requests and console output. To open a trace directly:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Linting

```bash
npm run lint        # check
npm run lint:fix    # fix what can be fixed automatically
```

ESLint uses the recommended JavaScript, TypeScript and Playwright rules, plus type-aware rules that catch a missing `await`.

## Continuous integration

The GitHub Actions workflow in [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs on every push and pull request to `main` or `master`:

1. **lint**
2. **ui-tests** and **api-tests**, in parallel, once lint has passed

Each test job uploads its HTML report as an artifact (`playwright-report-ui` and `playwright-report-api`), which can be downloaded from the workflow run.

The UI login credentials are supplied as the repository secrets `ADMIN_USER` and `ADMIN_PASSWORD`.

## Project structure

```
├── api/                  # API client for the Petstore pets endpoint
├── fixtures/             # Playwright fixtures that provide page objects and the API client to tests
├── pages/                # Page objects for the OrangeHRM login and dashboard pages
├── tests/
│   ├── api/              # API tests
│   └── ui/               # UI tests
├── environments.ts       # URLs and credentials for each environment
├── playwright.config.ts  # Test projects, reporters, retries, traces
└── eslint.config.mts     # Lint rules
```
