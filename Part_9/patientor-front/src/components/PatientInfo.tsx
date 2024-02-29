import { useEffect, useState } from "react";
import {
  Patient,
  Entry,
  Diagnosis,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HospitalEntry,
} from "../types";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

import diagnosisService from "../services/diagnoses";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface PatientInfoProps {
  patient: Patient | null | undefined;
}

interface EntryInfoProps {
  entry: Entry;
}

interface DiagnosisCodesProps {
  entry: Entry;
}

interface SpecificInfoProps {
  entry: Entry;
}

interface HealthCheckProps {
  entry: HealthCheckEntry;
}

interface OccupationalProps {
  entry: OccupationalHealthcareEntry;
}

interface HospitalProps {
  entry: HospitalEntry;
}

const HealthCheckSpecificInfo = (props: HealthCheckProps) => {
  if (!props.entry) return null;

  const entry = props.entry;

  const healthCheckInfo = () => {
    switch (entry.healthCheckRating) {
      case 0:
        return (
          <p>
            Health check level: <FavoriteIcon style={{ color: "green" }} />{" "}
            (Healthy)
          </p>
        );
      case 1:
        return (
          <p>
            Health check level: <FavoriteIcon style={{ color: "yellow" }} />{" "}
            (Low risk)
          </p>
        );
      case 2:
        return (
          <p>
            Health check level: <FavoriteIcon style={{ color: "orange" }} />{" "}
            (High risk)
          </p>
        );
      case 3:
        return (
          <p>
            Health check level: <FavoriteIcon style={{ color: "red" }} />{" "}
            (Critical risk)
          </p>
        );
      default:
        return <p>No Health check level specified</p>;
    }
  };

  return (
    <div>
      <p>
        Appointment type: Health Check <MedicalInformationIcon />
      </p>
      {healthCheckInfo()}
      <p>Seen by: {entry.specialist}</p>
    </div>
  );
};

const OccupationalSpecificInfo = (props: OccupationalProps) => {
  if (!props.entry) return null;

  const entry = props.entry;

  const sickLeave = () => {
    if (!entry.sickLeave) return null;

    return (
      <p>
        Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
      </p>
    );
  };

  return (
    <div>
      <p>
        Appointment type: Occupational Health <WorkIcon />
      </p>
      <p>Employer name {entry.employerName}</p>
      {entry.sickLeave && sickLeave()}
      <p>Seen by: {entry.specialist}</p>
    </div>
  );
};

const HospitalSpecificInfo = (props: HospitalProps) => {
  if (!props.entry) return null;

  const entry = props.entry;

  return (
    <div>
      <p>Appointment type: Hospital Admission {<LocalHospitalIcon />}</p>
      <p>Discharge date: {entry.discharge.date}</p>
      <p>Discharge criteria: {entry.discharge.criteria}</p>
      <p>Seen by: {entry.specialist}</p>
    </div>
  );
};

const SpecificInfo = (props: SpecificInfoProps) => {
  if (!props.entry) return null;

  const entry = props.entry;

  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckSpecificInfo entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalSpecificInfo entry={entry} />;
    case "Hospital":
      return <HospitalSpecificInfo entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const DiagnosisCodes = (props: DiagnosisCodesProps) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);

  useEffect(() => {
    const fetchDiagnoses = async (): Promise<void> => {
      const diagnosesFromServer = await diagnosisService.getAll();
      setDiagnoses(diagnosesFromServer);
    };
    fetchDiagnoses();
  }, []);

  if (!props.entry.diagnosisCodes || !diagnoses) return null;

  const diagnosisCodes = props.entry.diagnosisCodes;

  return (
    <ul>
      {diagnosisCodes.map((code) => {
        const description = diagnoses.find((d) => d.code === code);
        return (
          <li key={code}>
            {code} {""}
            {description && description.name}
          </li>
        );
      })}
    </ul>
  );
};

const EntryInfo = (props: EntryInfoProps) => {
  if (!props.entry) return null;

  const entry = props.entry;

  const style = { border: "1px solid", padding: "5px", borderRadius: "10px" };

  return (
    <div>
      <div style={style}>
        <p>
          {entry.date} {""} <i>{entry.description}</i>
        </p>
        <DiagnosisCodes entry={entry} />
        <SpecificInfo entry={entry} />
      </div>
      <br />
    </div>
  );
};

const PatientInfo = (props: PatientInfoProps) => {
  if (!props.patient) return <p>Patient info unavailable.</p>;

  const patient = props.patient;

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>Occupation: {patient.occupation}</p>
      <p>Gender: {patient.gender}</p>
      {patient.ssn && <p>SSN: {patient.ssn}</p>}
      {patient.dateOfBirth && <p>DOB: {patient.dateOfBirth}</p>}
      <br />
      <h3>Entry info:</h3>
      {patient.entries.map((entry) => (
        <EntryInfo key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default PatientInfo;
