"use client"

import styled from "@emotion/styled"
import { Typography, Grid, Card, CardContent, CardMedia } from "@mui/material"
import theme from "@/theme"
import Template from "../template"
import { ICard, db } from "../db/db"
import { use } from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { ContactEmergency } from "@mui/icons-material"

const ContentCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "3px 10px 37px -4px rgba(42, 52, 68, 0.5)",
})

export default function Everything() {
  const contentItems = [
    { type: "note", content: "Start typing here..." },
    {
      type: "image",
      content: ["https://picsum.photos/200"],
      title: "Product Image",
      price: "$22",
      author: "Mark Twain",
      description: "Eames Lounge Chair",
    },
    {
      type: "quote",
      content:
        "It's not what we don't know that gets us in trouble. It's what we know for sure that just ain't so.",
      author: "Mark Twain",
    },
    {
      type: "image",
      content: "https://unsplash.it/200",
      title: "Real Estate",
      price: "$425,000",
    },
    {
      type: "checklist",
      content: ["Tokyo, Japan", "Venice, Italy", "New York, USA"],
    },
    {
      type: "image",
      content: "https://loremflickr.com/200/200",
      title: "Furniture",
      description: "Eames Lounge Chair",
    },
  ] as ICard[]

  const cards = [...contentItems, useLiveQuery(() => db.card.toArray())].flat()
  console.log(cards)

  if (!cards) {
    return null
  }

  return (
    <Grid container spacing={3}>
      {cards.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <ContentCard>
            {item?.type === "note" && (
              <CardContent>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                  }}
                >
                  ADD NEW NOTE
                </Typography>
                <Typography variant="body1">{item.content}</Typography>
              </CardContent>
            )}
            {item?.type === "image" && (
              <>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.content as string}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="body1">{item.title}</Typography>
                  {item.price && (
                    <Typography variant="body2" color="text.secondary">
                      {item.price}
                    </Typography>
                  )}
                </CardContent>
              </>
            )}
            {item?.type === "quote" && (
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  "{item?.content}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  - {item?.author}
                </Typography>
              </CardContent>
            )}
            {item?.type === "checklist" && (
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  Places to visit
                </Typography>
                {Array.isArray(item.content) ? (
                  item.content.map((place, i) => (
                    <Typography key={i} variant="body2">
                      ☐ {place}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">☐ {item.content}</Typography>
                )}
              </CardContent>
            )}
          </ContentCard>
        </Grid>
      ))}
    </Grid>
  )
}
