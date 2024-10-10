"use client"

import styled from "@emotion/styled"
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  CircularProgress,
} from "@mui/material"
import theme from "@/theme"
import { useLiveDataCards } from "../../db/db"

const ContentCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "3px 10px 37px -4px rgba(42, 52, 68, 0.5)",
})

export default function Everything() {
  const cards = useLiveDataCards()

  if (!cards || cards.length === 0) {
    return <CircularProgress />
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <CardContent>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
            }}
          >
            ADD NEW NOTE
          </Typography>
          <TextField placeholder="Start typing here..." />
        </CardContent>
      </Grid>
      {cards.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <ContentCard>
            {item?.type === "text" && (
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {item?.description}
                </Typography>
              </CardContent>
            )}
            {item?.type === "image" && (
              <>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.content as string}
                />
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    {item?.description}
                  </Typography>
                </CardContent>
              </>
            )}
          </ContentCard>
        </Grid>
      ))}
    </Grid>
  )
}
