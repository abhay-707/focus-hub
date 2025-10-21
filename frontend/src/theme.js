import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#262626",
    },
    secondary: {
      main: "#1A1A1A",
    },
    error: {
      main: "#AD4848",
    },
    danger: {
      main: "#AD4848",
    },
    success: {
      main: "#94D284",
    },
    background: {
      default: "#0D0D0D",
      paper: "#262626",
    },
    text: {
      primary: "#F2F2F2",
      secondary: "#B3B3B3",
      success: "#94D284",
      danger: "#AD4848",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    body1: { fontSize: "1rem", fontWeight: 400 },
    button: { textTransform: "none", fontWeight: 500 },
  },
});

export default theme;
