import React from "react";
import { Box, Typography, Container, Divider, ButtonBase } from "@mui/material";
import { styled } from "@mui/material/styles";

import appointment from "./images/getAppointment.jpg";
import calendar from "./images/calendar.jpg";
import followup from './images/followup.jpg'
import { useNavigate } from "react-router-dom";

const images = [
  {
    url: calendar,
    title: "My Appointments",
    width: "50%",
    navigate: "/patient/dashboard/appointmentHistory",
  },
  {
    url: appointment,
    title: "Get Appointment",
    width: "50%",
    navigate: "/patient/dashboard/makeAppointment",
  },
];

const followUpImage = {
  url: followup,
  title: "Follow Up",
  width: "100%",
  navigate: "/patient/dashboard/followup",
}

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 350,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 100,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },
}));

const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
});

const Image = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create("opacity"),
}));

const ImageMarked = styled("span")(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  bottom: -2,
  left: "calc(50% - 9px)",
  transition: theme.transitions.create("opacity"),
}));


const PatientApp = () => {
  const navigate = useNavigate();
  const account = localStorage.getItem("patient");
  const accountHolder = JSON.parse(account);
  const name = String(accountHolder.name).toUpperCase();

  const handleClick = (e, path) => {
    e.preventDefault();
    navigate(path);
  };
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        HI, {name}
      </Typography>
      <Divider />

      <Box
        sx={{ display: "flex", flexWrap: "wrap", minWidth: 400, width: "100%" }}
      >
        {images.map((image) => (
          <ImageButton
            focusRipple
            key={image.title}
            style={{
              width: image.width,
            }}
            onClick={(e) => handleClick(e, image.navigate)}
          >
            <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                sx={{
                  position: "relative",
                  p: 4,
                  pt: 2,
                  pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                }}
              >
                {image.title}
                <ImageMarked className="MuiImageMarked-root" />
              </Typography>
            </Image>
          </ImageButton>
        ))}
      </Box>
      <Box
        sx={{ display: "flex", flexWrap: "wrap", minWidth: 400, width: "100%" }}
      >
          <ImageButton
            focusRipple
            key={followUpImage.title}
            style={{
              width: followUpImage.width,
            }}
            onClick={(e) => handleClick(e, followUpImage.navigate)}
          >
            <ImageSrc style={{ backgroundImage: `url(${followUpImage.url})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                sx={{
                  position: "relative",
                  p: 4,
                  pt: 2,
                  pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                }}
              >
                {followUpImage.title}
                <ImageMarked className="MuiImageMarked-root" />
              </Typography>
            </Image>
          </ImageButton>
      </Box>
    </Container>
  );
}

export default PatientApp