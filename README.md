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
- Playwright APIRequestContext
- dotenv

## Project structure

api/
book-store-api.ts

data/
student-data.csv

fixtures/
page.fixture.ts

models/
student-data.ts

pages/
book-store.page.ts
login.page.ts
profile.page.ts
student-registration.page.ts

resources/
profile.jpg

tests/
book-deletion.spec.ts
book-search.spec.ts
student-registration.spec.ts

utils/
csv-reader.ts
environment.ts

Prerequisites
Node.js
npm
Git
A DemoQA Book Store test account

Installation

Clone the repository:
git clone <repository-url>
cd demoqa-playwright-assignment

Install dependencies:
npm install

Install the Playwright Chromium browser:
npx playwright install chromium

Environment configuration
Copy .env.example to .env.

PowerShell:
Copy-Item .env.example .env

Add DemoQA test credentials to .env:
DEMOQA_USERNAME=your_username
DEMOQA_PASSWORD="your_password"

The password is quoted so that special characters such as # are preserved.
The .env file is excluded from version control and must not be committed.

Run tests

Run all tests:
npm test

Run tests in headed mode:
npm run test:headed

Run a specific test file:
npx playwright test tests/student-registration.spec.ts

Run Book Store search:
npx playwright test tests/book-search.spec.ts

Run book deletion:
npx playwright test tests/book-deletion.spec.ts

Open the latest HTML report:
npx playwright show-report

Test design
Page Object Model keeps locators and page interactions separate from test assertions.
Custom fixtures provide Page Objects and the Book Store API service.
CSV data supports the student registration scenarios.
API setup ensures Git Pocket Guide exists before the deletion flow.
The deletion test remains repeatable because the precondition is recreated when required.
Credentials and generated tokens are kept outside source control.

Notes
Tests run on Chromium.
The DemoQA application must be available.
The deletion scenario requires valid DemoQA Book Store credentials.
Test results, HTML reports, traces, and local environment files are not committed.
