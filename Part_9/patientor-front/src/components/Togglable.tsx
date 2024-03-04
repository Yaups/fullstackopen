import { ReactNode, useState } from "react";
import { Button } from "@mui/material";

interface TogglableProps {
  buttonText: string;
  children: ReactNode;
}

const Togglable = (props: TogglableProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  const style = { display: visible ? "" : "none" };

  return (
    <div>
      <div style={style}>{props.children}</div>
      <br />
      <Button variant="outlined" onClick={() => setVisible(!visible)}>
        {visible ? "Cancel" : props.buttonText}
      </Button>
    </div>
  );
};

export default Togglable;
