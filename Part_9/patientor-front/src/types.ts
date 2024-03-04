export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  entries: Entry[];
  ssn?: string;
  dateOfBirth?: string;
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export interface Discharge {
  date: string;
  criteria: string;
}

export interface SickLeave {
  startDate: string;
  endDate: string;
}

export type EntryType = "HealthCheck" | "OccupationalHealthcare" | "Hospital";

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export type HealthCheckEntryFormValues = Omit<HealthCheckEntry, "id">;

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: { startDate: string; endDate: string };
}

export type OccupationalEntryFormValues = Omit<
  OccupationalHealthcareEntry,
  "id"
>;

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: { date: string; criteria: string };
}

export type HospitalEntryFormValues = Omit<HospitalEntry, "id">;

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export type EntryFormValues =
  | HealthCheckEntryFormValues
  | OccupationalEntryFormValues
  | HospitalEntryFormValues;
