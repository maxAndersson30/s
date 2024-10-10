"use client"
import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
  palette: {
    primary: {
      main: "#ff8124",
    },
  },
})

export default theme
