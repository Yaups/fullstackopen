import patients from '../../data/patients';
import { NonSensitivePatient, NewPatient, Patient } from '../types';
import { v1 as uuid } from 'uuid';

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
  if (patient !== undefined) {
    return patient;
  }

  throw new Error('No patient found!');
};

const addNewPatient = (newPatient: NewPatient): NonSensitivePatient => {
  console.log('New patient added!', newPatient);

  console.log('Patients then:', patients);

  const patientToAdd: Patient = {
    id: uuid(),
    ...newPatient,
  };

  patients.push(patientToAdd);

  console.log('Patients now:', patients);

  return {
    id: patientToAdd.id,
    name: patientToAdd.name,
    dateOfBirth: patientToAdd.dateOfBirth,
    gender: patientToAdd.gender,
    occupation: patientToAdd.occupation,
  };
};

export default { getAllNonSensitivePatients, getPatient, addNewPatient };
