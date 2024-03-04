import { HospitalEntry } from "../../types";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

interface HospitalProps {
  entry: HospitalEntry;
}

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

export default HospitalSpecificInfo;
