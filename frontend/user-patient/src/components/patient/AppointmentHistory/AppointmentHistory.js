import { Container, Stack, Typography, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Iconify from "../../Iconify";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { blue } from "@mui/material/colors";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[700],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: blue[100],
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(id, date, opdType, doctorName, prescription) {
  return {
    id,
    date,
    opdType,
    doctorName,
    prescription,
  };
}

const AppointmentHistory = () => {
  const navigate = useNavigate();
  const [rows, setrows] = React.useState([]);

  const patient = localStorage.getItem("patient");
  const patientData = JSON.parse(patient);
  const jwtToken = localStorage.getItem("token");

  const downloadPrescription = async (e, appointmentDate, appointmentID) => {
    e.preventDefault();
    const patientID = patientData.patientId;

    // document.cookie = jwtToken

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${jwtToken}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8083/api/patientDetails/prescription/${patientID}/${appointmentDate}/${appointmentID}`,
      requestOptions
    )
      .then((response) => response.blob())
      .then((response) => {
        const url = URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        link.download = "prescription.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("API response:", response.data);
        if (response.data === "Prescription Uploaded successfully") {
          alert("Download fail !");
        } else {
          alert("Prescription downloaded !");
        }
      })
      .catch((error) => console.log("error", error));

    // TODO: update url with appointment id
    // window.location.href = `http://localhost:8083/api/patientDetails/prescription/${patientID}/${appointmentDate}/${appointmentID}`;
  };

  const getPatientData = async () => {
    const api = `http://localhost:8083/api/patientDetails/getAppointmentHistory/${patientData.patientId}`;

    let myHeaders = new Headers();

    myHeaders.set("Content-Type", "application/json");
    myHeaders.set("Authorization", `Bearer ${jwtToken}`);

    const requestOptions = {
      method: "POST",
      body: "",
      headers: myHeaders,
      redirect: "follow",
    };

    let appointmentRows = [];

    await fetch(api, requestOptions)
      .then(async (response) => {
        await response.json().then(async (e) => {
          await e.forEach((appointment) => {
            const id = JSON.stringify(appointment.appointmentID);
            const opdType = appointment.appointmentOpdType;
            const date = appointment.appointmentDate;
            const doctorFname = appointment.doctorDetails.doctorFirstName;
            const doctorLname = appointment.doctorDetails.doctorLastName;
            const doctorName = doctorFname + doctorLname;
            const prescription = appointment.prescription;
            const data = createData(
              id,
              date,
              opdType,
              doctorName,
              prescription
            );
            appointmentRows.push(data);
          });
          setrows(appointmentRows);
        });
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    getPatientData();
  }, []);

  const handleNewAddition = () => {
    navigate("/patient/dashboard/makeAppointment");
  };

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
            My Appointment History
          </Typography>
          <Button
            variant="contained"
            color="info"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleNewAddition}
          >
            Get Appointment
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Appointment ID</StyledTableCell>
                <StyledTableCell align="left">Date</StyledTableCell>
                <StyledTableCell align="left">OPD Type</StyledTableCell>
                <StyledTableCell align="left">Doctor</StyledTableCell>
                <StyledTableCell align="left">Prescription</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell>{row.date}</StyledTableCell>
                  <StyledTableCell>{row.opdType}</StyledTableCell>
                  <StyledTableCell>{row.doctorName}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="outlined"
                      color="info"
                      startIcon={<DownloadForOfflineIcon color="success" />}
                      onClick={async (e) =>
                        await downloadPrescription(e, row.date, row.id)
                      }
                    >
                      Download
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default AppointmentHistory;
