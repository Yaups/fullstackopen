"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEntries = exports.toNewEntry = exports.toNewPatient = void 0;
const types_1 = require("./types");
const toNewPatient = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if ('name' in object &&
        'dateOfBirth' in object &&
        'ssn' in object &&
        'gender' in object &&
        'occupation' in object) {
        const newPatient = {
            name: parseName(object.name),
            dateOfBirth: parseDateOfBirth(object.dateOfBirth),
            ssn: parseSsn(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation),
        };
        return newPatient;
    }
    throw new Error('Incorrect data: some fields are missing');
};
exports.toNewPatient = toNewPatient;
const toNewEntry = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if (!('type' in object) || !isString(object.type)) {
        throw new Error('Entry type not specified correctly');
    }
    switch (object.type) {
        case 'HealthCheck':
            return toNewHealthCheckEntry(object);
        case 'OccupationalHealthcare':
            return toNewOccupationalEntry(object);
        case 'Hospital':
            return toNewHospitalEntry(object);
        default:
            throw new Error('Entry type not specified correctly');
    }
};
exports.toNewEntry = toNewEntry;
const toNewHealthCheckEntry = (object) => {
    if ('description' in object &&
        'date' in object &&
        'specialist' in object &&
        'healthCheckRating' in object) {
        const newEntry = {
            type: 'HealthCheck',
            description: parseDescription(object.description),
            date: parseDate(object.date),
            specialist: parseSpecialist(object.specialist),
            healthCheckRating: parseHealthCheckRating(Number(object.healthCheckRating)),
        };
        if ('diagnosisCodes' in object) {
            newEntry.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
        }
        return newEntry;
    }
    throw new Error('Incorrect data: some fields are missing');
};
const toNewOccupationalEntry = (object) => {
    if ('description' in object &&
        'date' in object &&
        'specialist' in object &&
        'employerName' in object) {
        const newEntry = {
            type: 'OccupationalHealthcare',
            description: parseDescription(object.description),
            date: parseDate(object.date),
            specialist: parseSpecialist(object.specialist),
            employerName: parseEmployerName(object.employerName),
        };
        if ('diagnosisCodes' in object) {
            newEntry.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
        }
        if ('sickLeave' in object) {
            newEntry.sickLeave = parseSickLeave(object.sickLeave);
        }
        return newEntry;
    }
    throw new Error('Incorrect data: some fields are missing');
};
const toNewHospitalEntry = (object) => {
    if ('description' in object &&
        'date' in object &&
        'specialist' in object &&
        'discharge' in object) {
        const newEntry = {
            type: 'Hospital',
            description: parseDescription(object.description),
            date: parseDate(object.date),
            specialist: parseSpecialist(object.specialist),
            discharge: parseDischarge(object.discharge),
        };
        if ('diagnosisCodes' in object) {
            newEntry.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
        }
        return newEntry;
    }
    throw new Error('Incorrect data: some fields are missing');
};
const isNumber = (value) => {
    return !isNaN(Number(value));
};
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const isGender = (param) => {
    return Object.values(types_1.Gender)
        .map((value) => value.toString())
        .includes(param);
};
const isObject = (input) => {
    return typeof input === 'object' || input instanceof Object;
};
const isArray = (input) => {
    return Array.isArray(input);
};
const isHealthCheckRating = (number) => {
    return [0, 1, 2, 3].includes(number);
};
const isEntries = (input) => {
    return input.every((item) => isObject(item) && isEntry(item));
};
const isEntry = (object) => {
    if ('type' in object)
        return (object.type === 'Hospital' ||
            object.type === 'OccupationalHealthcare' ||
            object.type === 'HealthCheck');
    return false;
};
const parseName = (name) => {
    if (!isString(name) || name === '') {
        throw new Error('Incorrect or missing name');
    }
    return name;
};
const parseDateOfBirth = (dateOfBirth) => {
    if (!isString(dateOfBirth) || !isDate(dateOfBirth) || dateOfBirth === '') {
        throw new Error('Incorrect or missing date of birth');
    }
    return dateOfBirth;
};
const parseSsn = (ssn) => {
    if (!isString(ssn) || ssn === '') {
        throw new Error('Incorrect or missing ssn');
    }
    return ssn;
};
const parseGender = (gender) => {
    if (!isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender');
    }
    return gender;
};
const parseOccupation = (occupation) => {
    if (!isString(occupation) || occupation === '') {
        throw new Error('Incorrect or missing name');
    }
    return occupation;
};
const parseDescription = (description) => {
    if (!isString(description) || description === '') {
        throw new Error('Incorrect or missing description');
    }
    return description;
};
const parseDate = (date) => {
    if (!isString(date) || !isDate(date) || date === '') {
        throw new Error('Incorrect or missing date');
    }
    return date;
};
const parseSpecialist = (specialist) => {
    if (!isString(specialist) || specialist === '') {
        throw new Error('Incorrect or missing specialist');
    }
    return specialist;
};
const parseEmployerName = (employerName) => {
    if (!isString(employerName) || employerName === '') {
        throw new Error('Incorrect or missing employer name');
    }
    return employerName;
};
const parseHealthCheckRating = (healthCheckRating) => {
    if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
        throw new Error('Incorrect or missing health check rating!');
    }
    return healthCheckRating;
};
const parseDischarge = (discharge) => {
    if (!isObject(discharge) ||
        !('date' in discharge) ||
        !('criteria' in discharge)) {
        throw new Error('Incorrect or missing discharge info!');
    }
    if (!isString(discharge.date) ||
        !isDate(discharge.date) ||
        !isString(discharge.criteria) ||
        discharge.criteria === '') {
        throw new Error('Incorrect or missing discharge info!');
    }
    return { date: discharge.date, criteria: discharge.criteria };
};
const parseSickLeave = (sickLeave) => {
    if (!isObject(sickLeave) ||
        !('startDate' in sickLeave) ||
        !('endDate' in sickLeave)) {
        throw new Error('Incorrect or missing sick leave info!');
    }
    if (!isString(sickLeave.startDate) ||
        !isDate(sickLeave.startDate) ||
        !isString(sickLeave.endDate) ||
        !isDate(sickLeave.endDate)) {
        throw new Error('Incorrect or missing sick leave info!');
    }
    return { startDate: sickLeave.startDate, endDate: sickLeave.endDate };
};
const parseDiagnosisCodes = (diagnosisCodes) => {
    if (!isArray(diagnosisCodes)) {
        throw new Error('Incorrect diagnosis codes');
    }
    return diagnosisCodes;
};
const parseEntries = (entries) => {
    if (!isArray(entries) || !isEntries(entries)) {
        throw new Error('Incorrect or missing entries');
    }
    return entries;
};
exports.parseEntries = parseEntries;
