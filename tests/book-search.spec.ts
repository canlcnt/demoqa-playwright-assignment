import {
  test,
  expect,
} from '../fixtures/page.fixture';

test.describe('Book Store search', () => {
  test.beforeEach(async ({ bookStorePage }) => {
    await bookStorePage.goto();
  });

  test('should display only books matching the search criteria', async ({
    bookStorePage,
  }) => {
    const searchCriteria = 'Design';

    await bookStorePage.searchForBook(
      searchCriteria,
    );

    await expect
      .poll(async () => bookStorePage.bookRows.count())
      .toBeGreaterThan(1);

    const displayedBooks =
      await bookStorePage.getDisplayedBooks();

    const normalizedCriteria =
      searchCriteria.toLowerCase();

    for (const book of displayedBooks) {
      const titleMatches = book.title
        .toLowerCase()
        .includes(normalizedCriteria);

      const authorMatches = book.author
        .toLowerCase()
        .includes(normalizedCriteria);

      const publisherMatches = book.publisher
        .toLowerCase()
        .includes(normalizedCriteria);

      expect(
        titleMatches ||
          authorMatches ||
          publisherMatches,
        `Book record does not match "${searchCriteria}": ${JSON.stringify(
          book,
        )}`,
      ).toBe(true);
    }
  });
});