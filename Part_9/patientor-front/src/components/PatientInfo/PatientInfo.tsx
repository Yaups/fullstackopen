import { useState, useEffect } from "react";
import { Patient, Entry, Diagnosis } from "../../types";
import Togglable from "../Togglable";
import EntryForm from "../EntryForm/EntryForm";
import ErrorNotification from "../ErrorNotification";
import HealthCheckSpecificInfo from "./HealthCheckSpecificInfo";
import OccupationalSpecificInfo from "./OccupationalSpecificInfo";
import HospitalSpecificInfo from "./HospitalSpecificInfo";
import DiagnosisCodes from "./DiagnosisCodes";
import diagnosisService from "../../services/diagnoses";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface PatientInfoProps {
  patient: Patient | null | undefined;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

interface EntryInfoProps {
  entry: Entry;
  diagnoses: Diagnosis[] | null;
}

interface SpecificInfoProps {
  entry: Entry;
}

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
        <DiagnosisCodes entry={entry} diagnoses={props.diagnoses} />
        <SpecificInfo entry={entry} />
      </div>
      <br />
    </div>
  );
};

const PatientInfo = (props: PatientInfoProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);

  useEffect(() => {
    const fetchDiagnoses = async (): Promise<void> => {
      const diagnosesFromServer = await diagnosisService.getAll();
      setDiagnoses(diagnosesFromServer);
    };
    fetchDiagnoses();
  }, []);

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
        <EntryInfo key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <Togglable buttonText="Add new entry">
        <EntryForm
          patient={patient}
          setErrorMessage={setErrorMessage}
          diagnoses={diagnoses}
          patients={props.patients}
          setPatients={props.setPatients}
        />
      </Togglable>
    </div>
  );
};

export default PatientInfo;
