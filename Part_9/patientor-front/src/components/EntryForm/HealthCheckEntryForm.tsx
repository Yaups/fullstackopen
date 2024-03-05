import { useState } from "react";
import {
  Patient,
  HealthCheckEntryFormValues,
  HealthCheckRating,
  Diagnosis,
} from "../../types";
import patientService from "../../services/patients";
import axios from "axios";
import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Button,
  SelectChangeEvent,
  useTheme,
  OutlinedInput,
  Theme,
} from "@mui/material";
import TextField from "@mui/material/TextField";

interface EntryFormProps {
  patient: Patient;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  diagnoses: Diagnosis[] | null;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (code: string, diagnosisCode: string[], theme: Theme) => {
  return {
    fontWeight:
      diagnosisCode.indexOf(code) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const HealthCheckEntryForm = ({
  patient,
  patients,
  setPatients,
  diagnoses,
  setErrorMessage,
}: EntryFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(0);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const theme = useTheme();

  const baseDiagnosisCodes = ["Z57.1", "N30.0", "L60.1"];
  const diagnosisCodeOptions = diagnoses
    ? diagnoses.map((d) => d.code)
    : baseDiagnosisCodes;

  const handleDiagnosisChange = (
    event: SelectChangeEvent<typeof diagnosisCodes>
  ) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const values: HealthCheckEntryFormValues = {
      type: "HealthCheck",
      description,
      date,
      specialist,
      healthCheckRating,
    };

    if (diagnosisCodes.length > 0) {
      values.diagnosisCodes = diagnosisCodes;
    }

    try {
      const newEntry = await patientService.createEntry(patient.id, values);

      const patientToReplace = {
        ...patient,
        entries: patient.entries.concat(newEntry),
      };
      const patientsToSet = patients.map((p) =>
        p.id === patient.id ? patientToReplace : p
      );
      setPatients(patientsToSet);

      setDescription("");
      setDate("");
      setSpecialist("");
      setHealthCheckRating(0);
      setDiagnosisCodes([]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Unknown error occurred!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth>
        <TextField
          multiline={true}
          label="Description *"
          variant="outlined"
          type="text"
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
      </FormControl>
      <br />
      <br />
      <InputLabel id="date">Date *</InputLabel>
      <Input
        type="date"
        value={date}
        onChange={({ target }) => setDate(target.value)}
      />
      <br />
      <br />
      <TextField
        label="Specialist *"
        variant="outlined"
        type="text"
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
      />
      <br />
      <br />
      <FormControl>
        <InputLabel id="health-rating">Rating *</InputLabel>
        <Select
          labelId="health-rating"
          id="health-rating-select"
          value={healthCheckRating}
          label="Health rating"
          onChange={({ target }) => {
            const value = target.value;
            if (!isString(value)) setHealthCheckRating(value);
          }}
        >
          <MenuItem value={0}>Healthy</MenuItem>
          <MenuItem value={1}>Low risk</MenuItem>
          <MenuItem value={2}>High risk</MenuItem>
          <MenuItem value={3}>Critical risk</MenuItem>
        </Select>
      </FormControl>
      <br />
      <br />
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel>Diagnosis codes (Optional)</InputLabel>
        <Select
          multiple
          value={diagnosisCodes}
          onChange={handleDiagnosisChange}
          input={<OutlinedInput label="Code" />}
          MenuProps={MenuProps}
        >
          {diagnosisCodeOptions.map((code) => (
            <MenuItem
              key={code}
              value={code}
              style={getStyles(code, diagnosisCodes, theme)}
            >
              {code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <br />
      <Button type="submit" variant="contained">
        Add
      </Button>
    </form>
  );
};

export default HealthCheckEntryForm;
