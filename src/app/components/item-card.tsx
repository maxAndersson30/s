"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { CardContent, Typography, CardMedia } from "@mui/material"
import { styled } from "@mui/material/styles"
import { ICard } from "../db/db"

// Styled ContentCard based on your existing styles
const ContentCard = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "3px 10px 37px -4px rgba(42, 52, 68, 0.5)",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "4px 12px 40px -4px rgba(42, 52, 68, 0.6)",
  },
}))

interface ItemCardProps {
  item: ICard
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/everything?edit=${item.id}`)
  }

  return (
    <div>
      <ContentCard onClick={handleClick}>
        {item.type === "text" && (
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <div
                className="editor-content"
                dangerouslySetInnerHTML={{
                  __html: item?.description || "",
                }}
              />
            </Typography>
          </CardContent>
        )}
        {item.type === "image" && item.content && (
          <>
            <CardMedia
              component="img"
              image={item?.content[0]}
              alt={item.description}
            />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                {item.description}
              </Typography>
            </CardContent>
          </>
        )}
      </ContentCard>
    </div>
  )
}

export default ItemCard
