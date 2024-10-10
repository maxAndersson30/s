"use client"

import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Container,
  IconButton,
  Box,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import theme from "@/theme"
import Divider from "@mui/material/Box"
import { useObservable } from "dexie-react-hooks"
import { useRouter } from "next/navigation"

import { ReactNode, useEffect, useState } from "react"
import { db } from "../db/db"
import React from "react"
import { SearchProvider, useSearch } from "./SearchContext"

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
                borderTop: `solid 4px ${theme.palette.primary.main}`,
                pt: 1,
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
              onClick={() => db.card.clear()}
            >
              Serendipity
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
