import {
  test,
  expect,
} from '../fixtures/page.fixture';
import { environment } from '../utils/environment';

test.describe('Book deletion', () => {
  test('should delete Git Pocket Guide successfully', async ({
    page,
    loginPage,
    profilePage,
    bookStoreApi,
  }) => {
    const bookTitle = 'Git Pocket Guide';
    const deletionAlertMessage = 'Book deleted.';

    await loginPage.goto();

    await loginPage.login(
      environment.username,
      environment.password,
    );

    await expect(page).toHaveURL(/\/profile$/);

    await expect(
      profilePage.usernameValue,
    ).toHaveText(environment.username);

    await expect(
      profilePage.logoutButton,
    ).toBeVisible();

    await bookStoreApi.ensureBookInCollection(
      bookTitle,
    );

    await profilePage.goto();

    await profilePage.searchForBook(bookTitle);

    await expect(
      profilePage.bookRow(bookTitle),
    ).toHaveCount(1);

    await expect(
      profilePage.deleteControlForBook(
        bookTitle,
      ),
    ).toBeVisible();

    await profilePage.openDeleteConfirmation(
      bookTitle,
    );

    await expect(
      profilePage.deleteConfirmationTitle,
    ).toBeVisible();

    await expect(
      profilePage.deleteConfirmationMessage,
    ).toHaveText(
      'Do you want to delete this book?',
    );

    await expect(
      profilePage.confirmDeleteButton,
    ).toBeVisible();

    const actualAlertMessage =
      await profilePage
        .confirmDeletionAndAcceptAlert(
          deletionAlertMessage,
        );

    expect(actualAlertMessage).toBe(
      deletionAlertMessage,
    );

    await expect(
      profilePage.bookRow(bookTitle),
    ).toHaveCount(0);
  });
});
