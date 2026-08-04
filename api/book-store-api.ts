import type {
    APIRequestContext,
    APIResponse,
} from '@playwright/test';
import { environment } from '../utils/environment';

interface ApiLoginResponse {
    userId: string;
    token: string;
}

export interface ApiBook {
    isbn: string;
    title: string;
    subTitle: string;
    author: string;
    publish_date: string;
    publisher: string;
    pages: number;
    description: string;
    website: string;
}

interface UserResponse {
    userId: string;
    username: string;
    books: ApiBook[];
}

interface BooksResponse {
    books: ApiBook[];
}

interface Authentication {
    userId: string;
    token: string;
}

export class BookStoreApi {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async ensureBookInCollection(
        bookTitle: string,
    ): Promise<ApiBook> {
        const authentication =
            await this.authenticate();

        const catalogBook =
            await this.findCatalogBookByTitle(
                bookTitle,
                authentication.token,
            );

        const user =
            await this.getUser(authentication);

        const existingBook = user.books.find(
            (book) => book.isbn === catalogBook.isbn,
        );

        if (!existingBook) {
            await this.addBookToCollection(
                authentication,
                catalogBook.isbn,
            );
        }

        const updatedUser =
            await this.getUser(authentication);

        const addedBook = updatedUser.books.find(
            (book) => book.isbn === catalogBook.isbn,
        );

        if (!addedBook) {
            throw new Error(
                `Book was not found in the user collection after setup: ${bookTitle}`,
            );
        }

        return addedBook;
    }

    private async authenticate(): Promise<Authentication> {
        const response = await this.request.post(
            '/Account/v1/Login',
            {
                data: {
                    userName: environment.username,
                    password: environment.password,
                },
            },
        );

        await this.ensureResponseStatus(
            response,
            200,
            'Account login',
        );

        const responseBody =
            (await response.json()) as ApiLoginResponse;

        if (!responseBody.userId) {
            throw new Error(
                'Account login response does not contain userId',
            );
        }

        if (!responseBody.token) {
            throw new Error(
                'Account login response does not contain token',
            );
        }

        return {
            userId: responseBody.userId,
            token: responseBody.token,
        };
    }

    private async getUser(
        authentication: Authentication,
    ): Promise<UserResponse> {
        const response = await this.request.get(
            `/Account/v1/User/${authentication.userId}`,
            {
                headers: this.createAuthorizationHeaders(
                    authentication.token,
                ),
            },
        );

        await this.ensureResponseStatus(
            response,
            200,
            'Get user',
        );

        return (await response.json()) as UserResponse;
    }

    private async findCatalogBookByTitle(
        bookTitle: string,
        token: string,
    ): Promise<ApiBook> {
        const response = await this.request.get(
            '/BookStore/v1/Books',
            {
                headers: this.createAuthorizationHeaders(
                    token,
                ),
            },
        );

        await this.ensureResponseStatus(
            response,
            200,
            'Get Book Store catalog',
        );

        const responseBody =
            (await response.json()) as BooksResponse;

        const matchingBook = responseBody.books.find(
            (book) => book.title === bookTitle,
        );

        if (!matchingBook) {
            throw new Error(
                `Book was not found in the Book Store catalog: ${bookTitle}`,
            );
        }

        return matchingBook;
    }

    private async addBookToCollection(
        authentication: Authentication,
        isbn: string,
    ): Promise<void> {
        const response = await this.request.post(
            '/BookStore/v1/Books',
            {
                headers: this.createAuthorizationHeaders(
                    authentication.token,
                ),

                data: {
                    userId: authentication.userId,
                    collectionOfIsbns: [
                        {
                            isbn,
                        },
                    ],
                },
            },
        );

        await this.ensureResponseStatus(
            response,
            201,
            'Add book to collection',
        );
    }

    private createAuthorizationHeaders(
        token: string,
    ): Record<string, string> {
        return {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        };
    }

    private async ensureResponseStatus(
        response: APIResponse,
        expectedStatus: number,
        operationName: string,
    ): Promise<void> {
        if (response.status() !== expectedStatus) {
            throw new Error(
                `${operationName} failed with HTTP status ${response.status()}`,
            );
        }
    }
}