import patients from '../../data/patients';
import {
  NonSensitivePatient,
  NewPatient,
  Patient,
  Entry,
  NewEntry,
} from '../types';
import { v1 as uuid } from 'uuid';
import { parseEntries } from '../utils';

const getAllNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map((patient) => ({
    id: patient.id,
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    occupation: patient.occupation,
  }));
};

const getPatient = (id: string): Patient => {
  const patient = patients.find((p) => p.id === id);
  if (patient === undefined) {
    throw new Error('No patient found!');
  }

  if (!parseEntries(patient.entries)) {
    throw new Error('Incorrect or missing entries');
  }

  return patient;
};

const addNewPatient = (newPatient: NewPatient): NonSensitivePatient => {
  const patientToAdd: Patient = {
    id: uuid(),
    ...newPatient,
  };

  patients.push(patientToAdd);

  return {
    id: patientToAdd.id,
    name: patientToAdd.name,
    dateOfBirth: patientToAdd.dateOfBirth,
    gender: patientToAdd.gender,
    occupation: patientToAdd.occupation,
  };
};

const addNewEntry = (id: string, newEntry: NewEntry) => {
  const patient = patients.find((patient) => patient.id === id);

  if (patient === undefined) {
    throw new Error(`No patient found with id ${id}`);
  }

  const entryToAdd: Entry = {
    id: uuid(),
    ...newEntry,
  };

  patient.entries.push(entryToAdd);

  return entryToAdd;
};

export default {
  getAllNonSensitivePatients,
  getPatient,
  addNewPatient,
  addNewEntry,
};
