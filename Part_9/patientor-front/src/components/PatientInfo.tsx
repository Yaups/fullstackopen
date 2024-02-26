import { useEffect, useState } from "react";
import { Patient, Entry, Diagnosis } from "../types";

import diagnosisService from "../services/diagnoses";

interface PatientInfoProps {
  patient: Patient | null | undefined;
}

interface EntryInfoProps {
  entry: Entry;
}

interface DiagnosisCodesProps {
  entry: Entry;
}

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

  return (
    <div>
      <p>
        {entry.date} {""} <i>{entry.description}</i>
      </p>
      <DiagnosisCodes entry={entry} />
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
