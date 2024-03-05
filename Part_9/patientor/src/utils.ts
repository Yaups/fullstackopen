import {
  NewPatient,
  Gender,
  Entry,
  NewEntry,
  Diagnosis,
  Discharge,
  SickLeave,
  HealthCheckRating,
  NewHealthCheckEntry,
  NewOccupationalEntry,
  NewHospitalEntry,
} from './types';

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  ) {
    const newPatient: NewPatient = {
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

export const toNewEntry = (object: unknown): NewEntry => {
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

const toNewHealthCheckEntry = (object: object): NewHealthCheckEntry => {
  if (
    'description' in object &&
    'date' in object &&
    'specialist' in object &&
    'healthCheckRating' in object
  ) {
    const newEntry: NewHealthCheckEntry = {
      type: 'HealthCheck',
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
      healthCheckRating: parseHealthCheckRating(
        Number(object.healthCheckRating)
      ),
    };
    if ('diagnosisCodes' in object) {
      newEntry.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
    }

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

const toNewOccupationalEntry = (object: object): NewOccupationalEntry => {
  if (
    'description' in object &&
    'date' in object &&
    'specialist' in object &&
    'employerName' in object
  ) {
    const newEntry: NewOccupationalEntry = {
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

const toNewHospitalEntry = (object: object): NewHospitalEntry => {
  if (
    'description' in object &&
    'date' in object &&
    'specialist' in object &&
    'discharge' in object
  ) {
    const newEntry: NewHospitalEntry = {
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

const isNumber = (value: unknown): value is number => {
  return !isNaN(Number(value));
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((value) => value.toString())
    .includes(param);
};

const isObject = (input: unknown): input is object => {
  return typeof input === 'object' || input instanceof Object;
};

const isArray = (input: unknown): input is unknown[] => {
  return Array.isArray(input);
};

const isHealthCheckRating = (number: number): number is HealthCheckRating => {
  return [0, 1, 2, 3].includes(number);
};

const isEntries = (input: unknown[]): input is Entry[] => {
  return input.every((item) => isObject(item) && isEntry(item));
};

const isEntry = (object: object): object is Entry => {
  if ('type' in object)
    return (
      object.type === 'Hospital' ||
      object.type === 'OccupationalHealthcare' ||
      object.type === 'HealthCheck'
    );

  return false;
};

const parseName = (name: unknown): string => {
  if (!isString(name) || name === '') {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDate(dateOfBirth) || dateOfBirth === '') {
    throw new Error('Incorrect or missing date of birth');
  }
  return dateOfBirth;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn) || ssn === '') {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation) || occupation === '') {
    throw new Error('Incorrect or missing name');
  }
  return occupation;
};

const parseDescription = (description: unknown): string => {
  if (!isString(description) || description === '') {
    throw new Error('Incorrect or missing description');
  }
  return description;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date) || date === '') {
    throw new Error('Incorrect or missing date');
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist) || specialist === '') {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!isString(employerName) || employerName === '') {
    throw new Error('Incorrect or missing employer name');
  }
  return employerName;
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
    throw new Error('Incorrect or missing health check rating!');
  }
  return healthCheckRating;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (
    !isObject(discharge) ||
    !('date' in discharge) ||
    !('criteria' in discharge)
  ) {
    throw new Error('Incorrect or missing discharge info!');
  }
  if (
    !isString(discharge.date) ||
    !isDate(discharge.date) ||
    !isString(discharge.criteria) ||
    discharge.criteria === ''
  ) {
    throw new Error('Incorrect or missing discharge info!');
  }

  return { date: discharge.date, criteria: discharge.criteria };
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (
    !isObject(sickLeave) ||
    !('startDate' in sickLeave) ||
    !('endDate' in sickLeave)
  ) {
    throw new Error('Incorrect or missing sick leave info!');
  }
  if (
    !isString(sickLeave.startDate) ||
    !isDate(sickLeave.startDate) ||
    !isString(sickLeave.endDate) ||
    !isDate(sickLeave.endDate)
  ) {
    throw new Error('Incorrect or missing sick leave info!');
  }

  return { startDate: sickLeave.startDate, endDate: sickLeave.endDate };
};

const parseDiagnosisCodes = (
  diagnosisCodes: unknown
): Array<Diagnosis['code']> => {
  if (!isArray(diagnosisCodes)) {
    throw new Error('Incorrect diagnosis codes');
  }

  return diagnosisCodes as Array<Diagnosis['code']>;
};

export const parseEntries = (entries: unknown): Entry[] => {
  if (!isArray(entries) || !isEntries(entries)) {
    throw new Error('Incorrect or missing entries');
  }
  return entries;
};
