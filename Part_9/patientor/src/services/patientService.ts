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

const addNewPatient = (newPatient: NewPatient): NonSensitivePatient => {
  console.log('New patient added!', newPatient);

  console.log('Patients then:', patients);

  //add id field to patient

  /*
  const spoof: Patient = {
    id: uuid(),
    name: 'spoof spooferson',
    dateOfBirth: '1990-01-01',
    ssn: '234234',
    gender: 'male',
    occupation: 'spoof job',
  };
  */

  const spoof: Patient = {
    id: uuid(),
    ...newPatient,
  };

  patients.push(spoof);

  console.log('Patients now:', patients);

  return {
    id: spoof.id,
    name: spoof.name,
    dateOfBirth: spoof.dateOfBirth,
    gender: spoof.gender,
    occupation: spoof.occupation,
  };
};

export default { getAllNonSensitivePatients, addNewPatient };
