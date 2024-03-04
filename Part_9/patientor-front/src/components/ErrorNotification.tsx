interface ErrorNotificationProps {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const ErrorNotification = (props: ErrorNotificationProps) => {
  if (props.errorMessage === "") return null;

  setTimeout(() => props.setErrorMessage(""), 4000);
  return <h4 style={{ color: "red" }}>{props.errorMessage}</h4>;
};

export default ErrorNotification;
