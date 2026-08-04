import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import type { StudentData } from '../models/student-data';

interface StudentDataCsvRow {
    scenarioId: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    mobile: string;
    dateOfBirth: string;
    subjects: string;
    hobbies: string;
    pictureFileName: string;
    currentAddress: string;
    state: string;
    city: string;
}

function splitMultiValueField(value: string): string[] {
    if (value.trim() === '') {
        return [];
    }

    return value
        .split('|')
        .map((item) => item.trim())
        .filter((item) => item !== '');
}

export function readStudentData(scenarioId: string): StudentData {
    const csvFilePath = path.resolve(
        process.cwd(),
        'data',
        'student-data.csv',
    );

    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

    const rows = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    }) as StudentDataCsvRow[];

    const matchingRow = rows.find(
        (row) => row.scenarioId === scenarioId,
    );

    if (!matchingRow) {
        throw new Error(
            `Student data was not found for scenarioId: ${scenarioId}`,
        );
    }

    return {
        scenarioId: matchingRow.scenarioId,
        firstName: matchingRow.firstName,
        lastName: matchingRow.lastName,
        email: matchingRow.email,
        gender: matchingRow.gender,
        mobile: matchingRow.mobile,
        dateOfBirth: matchingRow.dateOfBirth,
        subjects: splitMultiValueField(matchingRow.subjects),
        hobbies: splitMultiValueField(matchingRow.hobbies),
        pictureFileName: matchingRow.pictureFileName,
        currentAddress: matchingRow.currentAddress,
        state: matchingRow.state,
        city: matchingRow.city,
    };
}