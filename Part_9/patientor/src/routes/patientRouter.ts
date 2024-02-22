/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientService.getAllNonSensitivePatients());
});

router.post('/', (req, res) => {
  console.log('Patient request received');

  //get object from request body
  const { name, dateOfBirth, gender, ssn, occupation } = req.body;

  //eventually perform validation on this input

  //add this patient to list of patients
  const newNonSensitivePatient = patientService.addNewPatient({
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
  });

  res.json(newNonSensitivePatient);
});

export default router;
