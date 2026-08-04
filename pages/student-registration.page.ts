import type { Locator, Page } from '@playwright/test';
import type { StudentData } from '../models/student-data';
import path from 'node:path';

export class StudentRegistrationPage {
    readonly page: Page;
    readonly formHeading: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly mobileInput: Locator;
    readonly dateOfBirthInput: Locator;
    readonly datePickerDialog: Locator;
    readonly monthSelect: Locator;
    readonly yearSelect: Locator;
    readonly subjectsInput: Locator;
    readonly pictureInput: Locator;
    readonly currentAddressInput: Locator;
    readonly stateDropdown: Locator;
    readonly cityDropdown: Locator;
    readonly submitButton: Locator;
    readonly confirmationModal: Locator;
    readonly confirmationMessage: Locator;
    readonly resultTable: Locator;

    constructor(page: Page) {
        this.page = page;

        this.formHeading = page.getByRole('heading', {
            name: 'Student Registration Form',
        });

        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.emailInput = page.getByPlaceholder('name@example.com');
        this.mobileInput = page.getByPlaceholder('Mobile Number');
        this.dateOfBirthInput = page.locator('#dateOfBirthInput');
        this.datePickerDialog = page.getByRole('dialog', {
            name: 'Choose Date',
        });

        this.monthSelect = this.datePickerDialog.locator(
            'select.react-datepicker__month-select',
        );

        this.yearSelect = this.datePickerDialog.locator(
            'select.react-datepicker__year-select',
        );
        this.subjectsInput = page.locator('#subjectsInput');
        this.pictureInput = page.locator('#uploadPicture');
        this.currentAddressInput = page.getByPlaceholder('Current Address');
        this.stateDropdown = page.locator('#state');
        this.cityDropdown = page.locator('#city');
        this.submitButton = page.getByRole('button', {
            name: 'Submit',
        });
        this.confirmationModal = page.locator('.modal-content');

        this.confirmationMessage = this.confirmationModal.getByText(
            'Thanks for submitting the form',
            { exact: true },
        );

        this.resultTable =
            this.confirmationModal.getByRole('table');
    }

    async goto(): Promise<void> {
        await this.page.goto('/automation-practice-form');
    }

    async fillMandatoryFields(
        student: StudentData,
    ): Promise<void> {
        await this.firstNameInput.fill(student.firstName);
        await this.lastNameInput.fill(student.lastName);
        await this.genderOption(student.gender).check();
        await this.mobileInput.fill(student.mobile);
    }

    async fillAllFields(
        student: StudentData,
    ): Promise<void> {
        await this.fillMandatoryFields(student);
        await this.emailInput.fill(student.email);

        await this.selectDateOfBirth(
            student.dateOfBirth,
        );

        await this.selectSubjects(student.subjects);
        await this.selectHobbies(student.hobbies);

        await this.uploadPicture(
            student.pictureFileName,
        );

        await this.currentAddressInput.fill(
            student.currentAddress,
        );

        await this.selectStateAndCity(
            student.state,
            student.city,
        );
    }

    async selectDateOfBirth(
        dateOfBirth: string,
    ): Promise<void> {
        const [year, month, day] =
            this.parseIsoDate(dateOfBirth);

        await this.dateOfBirthInput.click();

        await this.yearSelect.selectOption(year);
        await this.monthSelect.selectOption({
            value: String(Number(month) - 1),
        });

        await this.datePickerDialog
            .getByRole('gridcell', {
                name: this.buildDateAriaLabel(
                    year,
                    month,
                    day,
                ),
            })
            .click();
    }

    async selectSubjects(
        subjects: string[],
    ): Promise<void> {
        for (const subject of subjects) {
            await this.subjectsInput.fill(subject);

            await this.page
                .getByRole('option', {
                    name: subject,
                    exact: true,
                })
                .click();
        }
    }

    async selectHobbies(
        hobbies: string[],
    ): Promise<void> {
        for (const hobby of hobbies) {
            await this.hobbyOption(hobby).check();
        }
    }

    async uploadPicture(
        pictureFileName: string,
    ): Promise<void> {
        const picturePath = path.resolve(
            process.cwd(),
            'resources',
            pictureFileName,
        );

        await this.pictureInput.setInputFiles(
            picturePath,
        );
    }

    async selectStateAndCity(
        state: string,
        city: string,
    ): Promise<void> {
        await this.stateDropdown.click();

        await this.page
            .getByRole('option', {
                name: state,
                exact: true,
            })
            .click();

        await this.cityDropdown.click();

        await this.page
            .getByRole('option', {
                name: city,
                exact: true,
            })
            .click();
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    genderOption(gender: string): Locator {
        return this.page.getByLabel(gender, { exact: true });
    }

    hobbyOption(hobby: string): Locator {
        return this.page.getByLabel(hobby, { exact: true });
    }

    submittedValue(label: string): Locator {
        const resultRow = this.resultTable
            .getByRole('row')
            .filter({
                has: this.page.getByRole('cell', {
                    name: label,
                    exact: true,
                }),
            });

        return resultRow.getByRole('cell').last();
    }

    private parseIsoDate(
        dateOfBirth: string,
    ): [string, string, string] {
        const dateParts = dateOfBirth.split('-');

        if (dateParts.length !== 3) {
            throw new Error(
                `Date of Birth must use YYYY-MM-DD format: ${dateOfBirth}`,
            );
        }

        const [year, month, day] = dateParts;

        if (!year || !month || !day) {
            throw new Error(
                `Date of Birth contains a missing value: ${dateOfBirth}`,
            );
        }

        return [year, month, day];
    }

    private buildDateAriaLabel(
        year: string,
        month: string,
        day: string,
    ): string {
        const date = new Date(
            Date.UTC(
                Number(year),
                Number(month) - 1,
                Number(day),
            ),
        );

        const weekday = date.toLocaleDateString(
            'en-US',
            {
                weekday: 'long',
                timeZone: 'UTC',
            },
        );

        const monthName = date.toLocaleDateString(
            'en-US',
            {
                month: 'long',
                timeZone: 'UTC',
            },
        );

        const numericDay = Number(day);
        const ordinalSuffix =
            this.getOrdinalSuffix(numericDay);

        return `Choose ${weekday}, ${monthName} ${numericDay}${ordinalSuffix}, ${year}`;
    }

    private getOrdinalSuffix(day: number): string {
        if (day >= 11 && day <= 13) {
            return 'th';
        }

        switch (day % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }
}