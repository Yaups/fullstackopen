import { useState } from "react";
import { Patient, EntryType, Diagnosis } from "../../types";

import HealthCheckEntryForm from "./HealthCheckEntryForm";
import HospitalEntryForm from "./HospitalEntryForm";
import OccupationalEntryForm from "./OccupationalEntryForm";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface EntryFormProps {
  patient: Patient;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  diagnoses: Diagnosis[] | null;
}

const EntryForm = ({ patient, diagnoses, setErrorMessage }: EntryFormProps) => {
  const [formType, setFormType] = useState<EntryType>("HealthCheck");

  const style = { border: "1px dashed", padding: "5px", borderRadius: "10px" };

  return (
    <div style={style}>
      <h3>New entry</h3>
      <FormControl>
        <InputLabel id="form-type">Entry type</InputLabel>
        <Select
          labelId="form-type"
          id="form-type-select"
          value={formType}
          label="Form type"
          onChange={({ target }) => setFormType(target.value as EntryType)}
        >
          <MenuItem value={"HealthCheck"}>Health Check</MenuItem>
          <MenuItem value={"OccupationalHealthcare"}>
            Occupational Healthcare
          </MenuItem>
          <MenuItem value={"Hospital"}>Hospital Entry</MenuItem>
        </Select>
      </FormControl>
      <br />
      <br />
      {formType === "HealthCheck" && (
        <HealthCheckEntryForm
          patient={patient}
          setErrorMessage={setErrorMessage}
          diagnoses={diagnoses}
        />
      )}
      {formType === "Hospital" && (
        <HospitalEntryForm
          patient={patient}
          setErrorMessage={setErrorMessage}
          diagnoses={diagnoses}
        />
      )}
      {formType === "OccupationalHealthcare" && (
        <OccupationalEntryForm
          patient={patient}
          setErrorMessage={setErrorMessage}
          diagnoses={diagnoses}
        />
      )}
    </div>
  );
};

export default EntryForm;
