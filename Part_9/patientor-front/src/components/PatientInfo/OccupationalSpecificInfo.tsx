import { OccupationalHealthcareEntry } from "../../types";
import WorkIcon from "@mui/icons-material/Work";

interface OccupationalProps {
  entry: OccupationalHealthcareEntry;
}

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
      <p>Employer name: {entry.employerName}</p>
      {entry.sickLeave && sickLeave()}
      <p>Seen by: {entry.specialist}</p>
    </div>
  );
};

export default OccupationalSpecificInfo;
