import React from "react";
import {
  Container,
  Stack,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { indigo } from "@mui/material/colors";
import DuoIcon from "@mui/icons-material/Duo";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: indigo[700],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: indigo[100],
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(
  appointmentId,
  patientId,
  name,
  mobile,
  email,
  gender,
  age
) {
  return { appointmentId, patientId, name, mobile, email, gender, age };
}

const DashboardApp = () => {
  const navigate = useNavigate();

  const doctor = localStorage.getItem("doctor");
  const token = localStorage.getItem("token");
  const doctorData = JSON.parse(doctor);

  const [rows, setrows] = React.useState([]);
  const [appointment, setAppointment] = React.useState({});

  // ------------------------------------------------------------------------

  const redirectToCallRoom = async (appointmentID) => {
    const api = `http://localhost:8083/doctor/getAppointmentById/${appointmentID}`;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    let app;

    await fetch(api, requestOptions)
      .then(async (response) => {
        await response.json().then(async (e) => {
          console.log(e, " e");
          app = e;
          localStorage.setItem("appointment", JSON.stringify(app));
          console.log("appointment in dashboard ", app);
        });
        console.log("Appointmentss ", appointment);
        navigate("/callroom");
      })
      .catch((error) => console.log("error", error));
  };

  const getAppointments = async () => {
    const api = `http://localhost:8083/doctor/TodaysAppointments`;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const doctorID = JSON.stringify({
      doctorId: doctorData.doctorID,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: doctorID,
      redirect: "follow",
    };

    let appointmentRow = [];

    await fetch(api, requestOptions)
      .then(async (response) => {
        await response.json().then(async (e) => {
          await e.forEach(async (appointment) => {
            const id = String(appointment.appointmentID);
            const patient = appointment.patientDetails;

            const patientId = patient.patientID;
            const name =
              patient.patientFirstName + " " + patient.patientLastName;

            const patientDob = String(patient.patientDOB);
            const date = patientDob.split("/");
            const dd = date[0];
            const mm = date[1];
            const yyyy = date[2];

            const today = new Date();
            const dob = new Date(yyyy, mm - 1, dd);

            let age = today.getFullYear() - dob.getFullYear();

            let month = today.getMonth() - dob.getMonth();

            if (month === 0 && today.getDate() === dob.getDate()) age = 0;
            else if (
              month < 0 ||
              (month === 0 && today.getDate() < dob.getDate())
            ) {
              age = age - 1;
            }

            const ageInString = String(age);

            const data = createData(
              id,
              patientId,
              name,
              patient.patientMobileNumber,
              patient.patientEmail,
              patient.patientGender,
              ageInString
            );

            appointmentRow.push(data);
          });
          setrows(appointmentRow);
        });
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    getAppointments();
  }, []);

  return (
    <>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Today's Appointments
          </Typography>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Appointment ID</StyledTableCell>
                <StyledTableCell align="left">Patient ID</StyledTableCell>
                <StyledTableCell align="left">Patient Name</StyledTableCell>
                <StyledTableCell align="left">Mobile Number</StyledTableCell>
                <StyledTableCell align="left">Email ID</StyledTableCell>
                <StyledTableCell align="left">Gender</StyledTableCell>
                <StyledTableCell align="left">Age</StyledTableCell>
                <StyledTableCell align="left"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.appointmentId}>
                  <StyledTableCell component="th" scope="row">
                    {row.appointmentId}
                  </StyledTableCell>
                  <StyledTableCell>{row.patientId}</StyledTableCell>
                  <StyledTableCell>{row.name}</StyledTableCell>
                  <StyledTableCell>{row.mobile}</StyledTableCell>
                  <StyledTableCell>{row.email}</StyledTableCell>
                  <StyledTableCell>{row.gender}</StyledTableCell>
                  <StyledTableCell>{row.age}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="outlined"
                      color="info"
                      endIcon={<DuoIcon color="info" />}
                      onClick={async (e) =>
                        await redirectToCallRoom(row.appointmentId)
                      }
                    >
                      Consult
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <IconButton
          color="primary"
          aria-label="fetch more"
          onClick={getAppointments}
        >
          <AutorenewIcon /> <Typography fontSize={14}>Fetch more</Typography>
        </IconButton>
      </Container>
    </>
  );
};

export default DashboardApp;
