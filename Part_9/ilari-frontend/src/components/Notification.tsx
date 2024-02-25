import { NotificationProps } from "../types";

const Notification = (props: NotificationProps) => {
  setTimeout(() => props.setErrorMessage(""), 4000);
  return <h4 style={{ color: "red" }}>{props.errorMessage}</h4>;
};

export default Notification;
