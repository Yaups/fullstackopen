import { useState } from "react";
import {
  Patient,
  SickLeave,
  OccupationalEntryFormValues,
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
  SelectChangeEvent,
  Theme,
  useTheme,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";

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

const OccupationalEntryForm = ({
  patient,
  patients,
  setPatients,
  diagnoses,
  setErrorMessage,
}: EntryFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeave, setSickLeave] = useState<SickLeave>({
    startDate: "",
    endDate: "",
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

    const values: OccupationalEntryFormValues = {
      type: "OccupationalHealthcare",
      description,
      date,
      specialist,
      employerName,
    };

    if (diagnosisCodes.length > 0) {
      values.diagnosisCodes = diagnosisCodes;
    }

    if (sickLeave.endDate !== "" && sickLeave.startDate !== "") {
      values.sickLeave = sickLeave;
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
      setEmployerName("");
      setSickLeave({ startDate: "", endDate: "" });
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
      <TextField
        label="Employer *"
        variant="outlined"
        type="text"
        value={employerName}
        onChange={({ target }) => setEmployerName(target.value)}
      />
      <br />
      <br />
      <InputLabel id="sick-leave-start">
        Sick leave start date (Optional)
      </InputLabel>
      <Input
        type="date"
        value={sickLeave.startDate}
        onChange={({ target }) =>
          setSickLeave({ ...sickLeave, startDate: target.value })
        }
      />
      <br />
      <br />
      <InputLabel id="sick-leave-end">
        Sick leave end date (Optional)
      </InputLabel>
      <Input
        type="date"
        value={sickLeave.endDate}
        onChange={({ target }) =>
          setSickLeave({ ...sickLeave, endDate: target.value })
        }
      />
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

export default OccupationalEntryForm;
