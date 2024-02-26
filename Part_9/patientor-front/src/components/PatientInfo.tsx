import { Patient } from "../types";

interface PatientInfoProps {
  patient: Patient | null | undefined;
}

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
    </div>
  );
};

export default PatientInfo;
