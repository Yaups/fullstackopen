import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import { Patient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientInfo from "./components/PatientInfo/PatientInfo";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientToShow, setPatientToShow] = useState<Patient | null>(null);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  const match = useMatch("/patients/:id");
  const matchingPatient = match
    ? patients.find((p) => p.id === match.params.id)
    : null;

  useEffect(() => {
    const changePatientToShow = async () => {
      if (matchingPatient) {
        const patientToSet = await patientService.get(matchingPatient.id);
        setPatientToShow(patientToSet);
      }
    };
    changePatientToShow();
  }, [matchingPatient]);

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button
          type="button"
          component={Link}
          to="/"
          variant="contained"
          color="primary"
        >
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route
            path="/"
            element={
              <PatientListPage patients={patients} setPatients={setPatients} />
            }
          />
          <Route
            path="/patients/:id"
            element={
              <PatientInfo
                patient={patientToShow}
                patients={patients}
                setPatients={setPatients}
              />
            }
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
