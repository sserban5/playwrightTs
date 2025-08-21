# Copilot Instructions for playwrightTs

## Project Overview
This is a Playwright-based end-to-end testing project written in TypeScript. The codebase is organized for modular, maintainable test automation targeting web applications.

## Key Architecture & Patterns
- **Tests** are located in `tests/` and use Playwright's `test` API. Each spec file targets a feature or workflow.
- **Page Objects** are in `pages/` and encapsulate UI interactions. Instantiate with Playwright's `page` object.
- **Fixtures** in `fixtures/` provide reusable test setup/teardown logic.
- **Data Generators** in `data/` (e.g., `faker.ts`) provide utility functions for generating test data using [faker-js/faker].
- **Payloads** in `payloads/` (e.g., `pet.json`) are used for API testing and can be dynamically generated using faker utilities.
- **Config files**: `playwright.config.ts` is the main config; `playwright.config.js` may exist for legacy or alternate setups.

## Developer Workflows
- **Run all tests:**
  ```powershell
  npx playwright test
  ```
- **Run a specific test file:**
  ```powershell
  npx playwright test tests/login.spec.ts
  ```
- **View HTML test report:**
  ```powershell
  npx playwright show-report
  ```
- **Debug tests:** Use Playwright's `--debug` or `--headed` flags.
- **Generate test data:** Use exported functions from `data/faker.ts` (e.g., `generatePeople`).

## Project-Specific Conventions
- **Test data**: Always use utility functions from `data/` for generating random/fake data. Do not hardcode values in tests.
- **Page objects**: Instantiate with `new PageName(page)` and use methods for all UI actions.
- **API payloads**: Use faker-based generators for dynamic payloads when possible.
- **TypeScript**: All source/test files use `.ts` extension. Prefer type annotations for clarity.
- **Imports**: Use relative imports (e.g., `../data/faker`).

## Integration Points
- **External dependencies**: Playwright, @faker-js/faker.
- **Test results**: HTML reports in `playwright-report/`, raw results in `test-results/`.
- **Credentials/config**: Store in `config/` and import as needed.

## Examples
- **Generating a fake user:**
  ```typescript
  import { generatePeople } from '../data/faker';
  const user = generatePeople();
  ```
- **Using a page object:**
  ```typescript
  import { LoginPage } from '../pages/loginPage';
  const loginPage = new LoginPage(page);
  await loginPage.login(user.email, user.password);
  ```

## Key Files & Directories
- `tests/` - Test specs
- `pages/` - Page objects
- `data/` - Data generators
- `payloads/` - API payload templates
- `config/` - Credentials and URLs
- `playwright.config.ts` - Main config

---
_If any conventions or workflows are unclear, please provide feedback for further clarification._
