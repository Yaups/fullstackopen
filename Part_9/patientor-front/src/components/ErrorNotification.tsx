import { Alert } from "@mui/material";

interface ErrorNotificationProps {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const ErrorNotification = (props: ErrorNotificationProps) => {
  if (props.errorMessage === "") return null;

  setTimeout(() => props.setErrorMessage(""), 4000);
  return <Alert severity="error">{props.errorMessage}</Alert>;
};

export default ErrorNotification;
