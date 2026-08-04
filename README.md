# DemoQA Playwright Automation Assignment

End-to-end automation tests for DemoQA using Playwright and TypeScript.

## Test scenarios

1. Register a student with all fields successfully
2. Register a student with mandatory fields successfully
3. Search for books and verify all displayed records match the search criteria
4. Delete `Git Pocket Guide` successfully from the user collection

## Tech stack

- Playwright
- TypeScript
- Node.js
- CSV test data
- Page Object Model
- Custom Playwright fixtures
- Playwright `APIRequestContext`
- dotenv

## Project structure

```text
demoqa-playwright-assignment/
├── api/
│   └── book-store-api.ts
├── data/
│   └── student-data.csv
├── fixtures/
│   └── page.fixture.ts
├── models/
│   └── student-data.ts
├── pages/
│   ├── book-store.page.ts
│   ├── login.page.ts
│   ├── profile.page.ts
│   └── student-registration.page.ts
├── resources/
│   └── profile.jpg
├── tests/
│   ├── book-deletion.spec.ts
│   ├── book-search.spec.ts
│   └── student-registration.spec.ts
├── utils/
│   ├── csv-reader.ts
│   └── environment.ts
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.ts
└── README.md
```

## Prerequisites

Before running the project, make sure the following tools and resources are available:

- Node.js
- npm
- Git
- A DemoQA Book Store test account

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd demoqa-playwright-assignment
```

Replace `<repository-url>` with the HTTPS URL of this GitHub repository.

### 2. Install dependencies

```bash
npm install
```

### 3. Install the Playwright Chromium browser

```bash
npx playwright install chromium
```

## Environment configuration

Copy `.env.example` to a new `.env` file.

### PowerShell

```powershell
Copy-Item .env.example .env
```

### Command Prompt

```cmd
copy .env.example .env
```

Add the DemoQA test account credentials to `.env`:

```dotenv
DEMOQA_USERNAME=your_username
DEMOQA_PASSWORD="your_password"
```

The password is enclosed in double quotes so that special characters such as `#` are preserved.

The `.env` file is excluded from version control and must not be committed.

## Run tests

### Run all tests

```bash
npm test
```

### Run all tests in headed mode

```bash
npm run test:headed
```

### Run the student registration scenarios

```bash
npx playwright test tests/student-registration.spec.ts
```

### Run the Book Store search scenario

```bash
npx playwright test tests/book-search.spec.ts
```

### Run the book deletion scenario

```bash
npx playwright test tests/book-deletion.spec.ts
```

### Open the latest HTML report

```bash
npx playwright show-report
```

## Test coverage

The final suite contains four end-to-end business scenarios:

- Register a student with all fields
- Register a student with mandatory fields only
- Search for books and validate every displayed result
- Delete `Git Pocket Guide` from the user collection

## Test design

### Page Object Model

Page Objects keep locators and page interactions separate from test assertions.

### Custom fixtures

Custom Playwright fixtures provide Page Objects and the Book Store API service to the tests.

### Data-driven registration

Student registration data is stored in CSV format and converted into typed test data before the UI flow is executed.

### API precondition

The deletion scenario uses Playwright `APIRequestContext` to ensure that `Git Pocket Guide` exists in the user's collection before the UI deletion flow begins.

The setup is idempotent:

- If the book is missing, the API adds it.
- If the book already exists, the setup does not add a duplicate.

### Repeatable deletion flow

The deletion test recreates its own precondition when required, deletes the selected book through the UI, verifies the native browser alert, and confirms that the book is no longer displayed.

### Secret management

Credentials are loaded from the local `.env` file.

Passwords, generated tokens, test results, traces, and HTML reports are excluded from source control.

## Notes

- Tests run on Chromium.
- The DemoQA application must be available during execution.
- The deletion scenario requires valid DemoQA Book Store credentials.
- The `.env` file must be created locally before running authenticated scenarios.
- `node_modules`, test results, HTML reports, traces, and local environment files are not committed.
