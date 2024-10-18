"use client"

import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Container,
  Box,
} from "@mui/material"
import theme from "@/theme"
import Divider from "@mui/material/Box"
import { useObservable } from "dexie-react-hooks"
import { useRouter } from "next/navigation"
import HistoryIcon from "@mui/icons-material/History"
import { ReactNode, useEffect } from "react"
import { db } from "../db/db"
import React from "react"
import { SearchProvider, useSearch } from "./SearchContext"

// TODO: Seems this component is not used in the project. Can we remove it or is it planned to be used?
export default function Template({ children }: { children: ReactNode }) {
  const router = useRouter()

  const dexieCloudUser = useObservable(db.cloud.currentUser) || {
    userId: "unauthorized",
    email: "",
  }

  useEffect(() => {
    if (dexieCloudUser.userId === "unauthorized") {
      router.push("/")
    }
  }, [dexieCloudUser.userId, router])

  return (
    <SearchProvider>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          minHeight: "100vh",
        }}
      >
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "0 16px",
            }}
          >
            <SearchField />
            <Typography
              variant="body1"
              sx={{
                mx: 2,
                pt: 1,
                borderTop: `solid 4px ${theme.palette.primary.main}`,
                fontSize: "1.2rem", // Större textstorlek vid aktivt val
              }}
              color="primary"
            >
              Everything
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mx: 2,
                borderTop: `solid 4px transparent`,
                pt: 1,
              }}
            >
              Spaces
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mx: 2,
                borderTop: `solid 4px transparent`,
                pt: 1,
              }}
            >
              Serendipity
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mx: 2,
                borderTop: `solid 4px transparent`,
                pt: 1,
              }}
              onClick={() => {
                confirm("Reset all stored data?") && db.card.clear()
              }}
            >
              <HistoryIcon />
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, pt: 0, mt: 0 }}>
          <Divider
            sx={{
              mb: 2,
              width: "100%",
              border: `solid 1px ${theme.palette.divider}`,
            }}
          />
          {children}
        </Box>
      </Container>
    </SearchProvider>
  )
}

// Sökfältet som använder Context
function SearchField() {
  const { searchKeyword, setSearchKeyword } = useSearch()

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search my mind..."
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)} // Uppdaterar sökordet
      InputProps={{
        style: {
          font: "400 70px / 84px var(--font-caveat)",
          fontStyle: "italic",
        },
      }}
      sx={{
        flexGrow: 1,
        fontStyle: "italic",
        color: "text.secondary",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            border: "none",
          },
          "&:hover fieldset": {
            border: "none",
          },
          "&.Mui-focused fieldset": {
            border: "none",
          },
        },
      }}
    />
  )
}
