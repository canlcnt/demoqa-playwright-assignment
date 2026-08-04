import type {
  Locator,
  Page,
} from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageHeading = page.getByRole('heading', {
      name: 'Login',
      exact: true,
    });

    this.usernameInput =
      page.getByPlaceholder('UserName');

    this.passwordInput =
      page.getByPlaceholder('Password');

    this.loginButton = page.getByRole('button', {
      name: 'Login',
      exact: true,
    });

    this.loginErrorMessage = page.getByText(
      'Invalid username or password!',
      { exact: true },
    );
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(
    username: string,
    password: string,
  ): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}