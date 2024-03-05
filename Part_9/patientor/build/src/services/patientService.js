"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
const getAllNonSensitivePatients = () => {
    return patients_1.default.map((patient) => ({
        id: patient.id,
        name: patient.name,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        occupation: patient.occupation,
    }));
};
const getPatient = (id) => {
    const patient = patients_1.default.find((p) => p.id === id);
    if (patient === undefined) {
        throw new Error('No patient found!');
    }
    return patient;
};
const addNewPatient = (newPatient) => {
    const patientToAdd = Object.assign({ id: (0, uuid_1.v1)(), entries: [] }, newPatient);
    patients_1.default.push(patientToAdd);
    return {
        id: patientToAdd.id,
        name: patientToAdd.name,
        dateOfBirth: patientToAdd.dateOfBirth,
        gender: patientToAdd.gender,
        occupation: patientToAdd.occupation,
    };
};
const addNewEntry = (id, newEntry) => {
    const patient = patients_1.default.find((patient) => patient.id === id);
    if (patient === undefined) {
        throw new Error(`No patient found with id ${id}`);
    }
    const entryToAdd = Object.assign({ id: (0, uuid_1.v1)() }, newEntry);
    patient.entries.push(entryToAdd);
    return entryToAdd;
};
exports.default = {
    getAllNonSensitivePatients,
    getPatient,
    addNewPatient,
    addNewEntry,
};
