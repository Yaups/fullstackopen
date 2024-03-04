import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { HealthCheckEntry } from "../../types";

interface HealthCheckProps {
  entry: HealthCheckEntry;
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

export default HealthCheckSpecificInfo;
