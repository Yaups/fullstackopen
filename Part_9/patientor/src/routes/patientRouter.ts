import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientService.getAllNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const id: string = req.params.id;
  try {
    const patient = patientService.getPatient(id);
    res.json(patient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const newNonSensitivePatient = patientService.addNewPatient(newPatient);
    res.status(201).json(newNonSensitivePatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    console.log('New entry request received!');

    const id = req.params.id;
    const newEntry = toNewEntry(req.body);
    const toSend = patientService.addNewEntry(id, newEntry);
    res.status(201).json(toSend);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
});

export default router;
