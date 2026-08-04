import {
    test,
    expect,
} from '../fixtures/page.fixture';
import { readStudentData } from '../utils/csv-reader';

function formatDateOfBirthForResult(
    inputValue: string,
): string {
    const monthNames: Record<string, string> = {
        Jan: 'January',
        Feb: 'February',
        Mar: 'March',
        Apr: 'April',
        May: 'May',
        Jun: 'June',
        Jul: 'July',
        Aug: 'August',
        Sep: 'September',
        Oct: 'October',
        Nov: 'November',
        Dec: 'December',
    };

    const [day, shortMonth, year] =
        inputValue.split(' ');

    const fullMonth = monthNames[shortMonth];

    if (!day || !fullMonth || !year) {
        throw new Error(
            `Unexpected Date of Birth format: ${inputValue}`,
        );
    }

    return `${day} ${fullMonth},${year}`;
}

function parseSubmittedList(
    submittedValue: string,
): string[] {
    return submittedValue
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '')
        .sort();
}

test.describe('Student Registration Form', () => {
    test.beforeEach(async ({
        studentRegistrationPage,
    }) => {
        await studentRegistrationPage.goto();
    });

    test('should register a student with mandatory fields successfully', async ({
        studentRegistrationPage,
    }) => {
        const student = readStudentData('case1.2');

        await studentRegistrationPage.fillMandatoryFields(
            student,
        );

        const defaultDateOfBirth =
            await studentRegistrationPage.dateOfBirthInput.inputValue();

        const expectedSubmittedDateOfBirth =
            formatDateOfBirthForResult(defaultDateOfBirth);

        await studentRegistrationPage.submit();

        await expect(
            studentRegistrationPage.confirmationMessage,
        ).toBeVisible();

        await expect(
            studentRegistrationPage.submittedValue(
                'Student Name',
            ),
        ).toHaveText(
            `${student.firstName} ${student.lastName}`,
        );

        await expect(
            studentRegistrationPage.submittedValue('Gender'),
        ).toHaveText(student.gender);

        await expect(
            studentRegistrationPage.submittedValue('Mobile'),
        ).toHaveText(student.mobile);

        await expect(
            studentRegistrationPage.submittedValue(
                'Date of Birth',
            ),
        ).toHaveText(expectedSubmittedDateOfBirth);

        await expect(
            studentRegistrationPage.submittedValue(
                'Student Email',
            ),
        ).toHaveText('');

        await expect(
            studentRegistrationPage.submittedValue('Subjects'),
        ).toHaveText('');

        await expect(
            studentRegistrationPage.submittedValue('Hobbies'),
        ).toHaveText('');

        await expect(
            studentRegistrationPage.submittedValue('Picture'),
        ).toHaveText('');

        await expect(
            studentRegistrationPage.submittedValue('Address'),
        ).toHaveText('');

        await expect(
            studentRegistrationPage.submittedValue(
                'State and City',
            ),
        ).toHaveText('');
    });

    test('should register a student with all fields successfully', async ({
        studentRegistrationPage,
    }) => {
        const student = readStudentData('case1.1');

        await studentRegistrationPage.fillAllFields(
            student,
        );

        const selectedDateOfBirth =
            await studentRegistrationPage.dateOfBirthInput.inputValue();

        const expectedSubmittedDateOfBirth =
            formatDateOfBirthForResult(
                selectedDateOfBirth,
            );

        await studentRegistrationPage.submit();

        await expect(
            studentRegistrationPage.confirmationMessage,
        ).toBeVisible();

        await expect(
            studentRegistrationPage.submittedValue(
                'Student Name',
            ),
        ).toHaveText(
            `${student.firstName} ${student.lastName}`,
        );

        await expect(
            studentRegistrationPage.submittedValue(
                'Student Email',
            ),
        ).toHaveText(student.email);

        await expect(
            studentRegistrationPage.submittedValue(
                'Gender',
            ),
        ).toHaveText(student.gender);

        await expect(
            studentRegistrationPage.submittedValue(
                'Mobile',
            ),
        ).toHaveText(student.mobile);

        await expect(
            studentRegistrationPage.submittedValue(
                'Date of Birth',
            ),
        ).toHaveText(expectedSubmittedDateOfBirth);

        const submittedSubjectsText =
            await studentRegistrationPage
                .submittedValue('Subjects')
                .innerText();

        expect(
            parseSubmittedList(submittedSubjectsText),
        ).toEqual(
            [...student.subjects].sort(),
        );

        const submittedHobbiesText =
            await studentRegistrationPage
                .submittedValue('Hobbies')
                .innerText();

        expect(
            parseSubmittedList(submittedHobbiesText),
        ).toEqual(
            [...student.hobbies].sort(),
        );

        await expect(
            studentRegistrationPage.submittedValue(
                'Picture',
            ),
        ).toHaveText(student.pictureFileName);

        await expect(
            studentRegistrationPage.submittedValue(
                'Address',
            ),
        ).toHaveText(student.currentAddress);

        await expect(
            studentRegistrationPage.submittedValue(
                'State and City',
            ),
        ).toHaveText(
            `${student.state} ${student.city}`,
        );
    });
});