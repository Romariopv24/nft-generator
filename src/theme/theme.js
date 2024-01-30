import { createTheme } from "@mui/material"

const font = "'Inter', sans-serif"

export const DarkTheme = createTheme({
  palette: {
    primary: {
      main: "rgba(13, 37, 79, 1)"
    },
    secondary: {
      main: "rgba(19,38,81,255)"
    },
    dark: {
      main: "rgba(11,24,58,255)"
    },
    light: {
      main: "rgba(0,134,255,255)"
    },
    business: {
      background: "#121220"
    },
    sec: {
      main: "rgba(255, 0, 79, 1)",
      light: "rgba(255, 0, 79, 1)",
      dark: "rgba(255, 0, 79, 1)",
      contrastText: "#fff"
    },
    custom: {
      main: "rgb(50, 72, 106, 1)",
      sec: "rgba(255, 0, 79, 1)",
      white: "rgba(255, 255, 255,1)",
      black: "rgba(0, 0, 0, 1)",
      grey: "rgba(239,241,253,255)"
    }
  },
  typography: {
    fontFamily: font
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        `
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          color: "#fff",
          fontWeight: "600",
          "&:hover": {
            boxShadow: "none"
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: "55px",
          background: "#fff",
          fontWeight: "600",
          color: "#000"
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          fontSize: "18px",
          fontWeight: "500"
        }
      }
    },
    MuiBadge: {
      styleOverrides: {
        colorSecondary: {
          color: "#fff"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          color: "#fff"
        },
        outlined: {
          color: "#fff"
        }
      }
    }
  }
})
