import type {
    Locator,
    Page,
} from '@playwright/test';

export class ProfilePage {
    readonly page: Page;
    readonly usernameValue: Locator;
    readonly logoutButton: Locator;
    readonly searchInput: Locator;
    readonly bookTable: Locator;
    readonly bookRows: Locator;
    readonly deleteConfirmationModal: Locator;
    readonly deleteConfirmationTitle: Locator;
    readonly deleteConfirmationMessage: Locator;
    readonly confirmDeleteButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.usernameValue =
            page.locator('#userName-value');

        this.logoutButton = page.getByRole('button', {
            name: 'Logout',
            exact: true,
        });

        this.searchInput =
            page.getByPlaceholder('Type to search');

        this.bookTable = page.getByRole('table');

        this.bookRows =
            this.bookTable.locator('tbody tr');

        this.deleteConfirmationModal = page
            .locator('.modal-content')
            .filter({
                hasText: 'Delete Book',
            });

        this.deleteConfirmationTitle =
            this.deleteConfirmationModal.getByText(
                'Delete Book',
                {
                    exact: true,
                },
            );

        this.deleteConfirmationMessage =
            this.deleteConfirmationModal.getByText(
                'Do you want to delete this book?',
                {
                    exact: true,
                },
            );

        this.confirmDeleteButton =
            this.deleteConfirmationModal.getByRole(
                'button',
                {
                    name: 'OK',
                    exact: true,
                },
            );
    }

    async goto(): Promise<void> {
        await this.page.goto('/profile');
    }

    async searchForBook(
        bookTitle: string,
    ): Promise<void> {
        await this.searchInput.fill(bookTitle);
    }

    bookRow(bookTitle: string): Locator {
        return this.bookRows.filter({
            has: this.page.getByRole('link', {
                name: bookTitle,
                exact: true,
            }),
        });
    }

    deleteControlForBook(
        bookTitle: string,
    ): Locator {
        return this.bookRow(bookTitle).getByTitle(
            'Delete',
            {
                exact: true,
            },
        );
    }

    async openDeleteConfirmation(
        bookTitle: string,
    ): Promise<void> {
        await this.deleteControlForBook(
            bookTitle,
        ).click();
    }

    async confirmDeletionAndAcceptAlert(
        expectedAlertMessage: string,
    ): Promise<string> {
        const dialogPromise =
            this.page.waitForEvent('dialog');

        await this.confirmDeleteButton.click();

        const dialog = await dialogPromise;
        const actualMessage = dialog.message();

        if (actualMessage !== expectedAlertMessage) {
            await dialog.dismiss();

            throw new Error(
                `Unexpected deletion alert message: ${actualMessage}`,
            );
        }

        await dialog.accept();

        return actualMessage;
    }
}