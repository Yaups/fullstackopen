import { useState } from "react";
import {
  Patient,
  Discharge,
  HospitalEntryFormValues,
  Diagnosis,
} from "../../types";
import patientService from "../../services/patients";
import axios from "axios";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  useTheme,
  Theme,
  SelectChangeEvent,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";

interface EntryFormProps {
  patient: Patient;
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

const HospitalEntryForm = ({
  patient,
  diagnoses,
  setErrorMessage,
}: EntryFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [discharge, setDischarge] = useState<Discharge>({
    date: "",
    criteria: "",
  });
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

    console.log("Submitting form for", patient.name);

    const values: HospitalEntryFormValues = {
      type: "Hospital",
      description,
      date,
      specialist,
      discharge,
    };

    if (diagnosisCodes.length > 0) {
      values.diagnosisCodes = diagnosisCodes;
    }

    try {
      const newEntry = await patientService.createEntry(patient.id, values);

      console.log("New entry is: ", newEntry);

      //CONCAT NEW ENTRY INTO PATIENT'S ENTRIES

      setDescription("");
      setDate("");
      setSpecialist("");
      setDischarge({ date: "", criteria: "" });
      setDiagnosisCodes([]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.error);
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
          required={true}
          label="Description"
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
        required={true}
        type="date"
        value={date}
        onChange={({ target }) => setDate(target.value)}
      />
      <br />
      <br />
      <TextField
        required={true}
        label="Specialist"
        variant="outlined"
        type="text"
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
      />
      <br />
      <br />
      <InputLabel id="discharge-date">Discharge date *</InputLabel>
      <Input
        required={true}
        type="date"
        value={discharge.date}
        onChange={({ target }) =>
          setDischarge({ ...discharge, date: target.value })
        }
      />
      <br />
      <br />
      <FormControl fullWidth>
        <TextField
          multiline={true}
          required={true}
          label="Discharge criteria"
          variant="outlined"
          type="text"
          value={discharge.criteria}
          onChange={({ target }) =>
            setDischarge({ ...discharge, criteria: target.value })
          }
        />
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

export default HospitalEntryForm;
