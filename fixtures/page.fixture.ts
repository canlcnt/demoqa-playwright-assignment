import {
  test as base,
  expect,
} from '@playwright/test';
import { StudentRegistrationPage } from '../pages/student-registration.page';
import { BookStorePage } from '../pages/book-store.page';
import { LoginPage } from '../pages/login.page';
import { ProfilePage } from '../pages/profile.page';
import { BookStoreApi } from '../api/book-store-api';

interface PageFixtures {
  studentRegistrationPage: StudentRegistrationPage;
  bookStorePage: BookStorePage;
  loginPage: LoginPage;
  profilePage: ProfilePage;
  bookStoreApi: BookStoreApi;
}

export const test = base.extend<PageFixtures>({
  studentRegistrationPage: async ({ page }, use) => {
    const studentRegistrationPage =
      new StudentRegistrationPage(page);

    await use(studentRegistrationPage);
  },

  bookStorePage: async ({ page }, use) => {
    const bookStorePage = new BookStorePage(page);

    await use(bookStorePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await use(loginPage);
  },

  profilePage: async ({ page }, use) => {
    const profilePage = new ProfilePage(page);

    await use(profilePage);
  },

  bookStoreApi: async ({ request }, use) => {
    const bookStoreApi =
      new BookStoreApi(request);

    await use(bookStoreApi);
  },
});

export { expect };