import type {
    Locator,
    Page,
} from '@playwright/test';

export interface BookRecord {
    title: string;
    author: string;
    publisher: string;
}

export class BookStorePage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly bookTable: Locator;
    readonly tableHeaders: Locator;
    readonly bookRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput =
            page.getByPlaceholder('Type to search');

        this.bookTable = page.getByRole('table');
        this.tableHeaders =
            this.bookTable.getByRole('columnheader');

        this.bookRows =
            this.bookTable.locator('tbody tr');
    }

    async goto(): Promise<void> {
        await this.page.goto('/books');
    }

    async searchForBook(
        searchCriteria: string,
    ): Promise<void> {
        await this.searchInput.fill(searchCriteria);
    }

    async getDisplayedBooks(): Promise<BookRecord[]> {
        const rows = await this.bookRows.all();
        const books: BookRecord[] = [];

        for (const row of rows) {
            const cells = row.getByRole('cell');

            books.push({
                title: (
                    await cells.nth(1).innerText()
                ).trim(),

                author: (
                    await cells.nth(2).innerText()
                ).trim(),

                publisher: (
                    await cells.nth(3).innerText()
                ).trim(),
            });
        }

        return books;
    }
}