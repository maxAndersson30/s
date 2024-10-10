"use client"

import { useState } from "react"
import { v4 as uuid } from "uuid"
import { createCard, ICard } from "../db/db"
import dayjs from "dayjs"
import Tiptap from "@/app/components/tiptap"
import theme from "@/theme"
import Button from "@mui/material/Button"
import { Typography, CardContent } from "@mui/material"
import { ContentCard } from "../(pages)/everything/page"
import { useSearch } from "../(pages)/SearchContext"

const NewCard = () => {
  const [isEdited, setIsEdited] = useState(false)
  const [canPost, setCanPost] = useState(false)
  const [isEditorEmpty, setIsEditorEmpty] = useState(true)
  const [editorContent, setEditorContent] = useState("")
  const { searchKeyword, setSearchKeyword } = useSearch()

  // Funktion som körs när Ctrl+Enter eller Cmd+Enter trycks
  const handlePost = (content: string) => {
    const card = {
      id: uuid(),
      type: "text",
      description: content,
      createdAt: dayjs().toISOString(),
    } as ICard

    createCard(card)
    setEditorContent("")
    setCanPost(false)
    setIsEdited(false)
    setIsEditorEmpty(true)
    setSearchKeyword("")
  }
  return (
    <div>
      <ContentCard
        sx={{
          position: "relative",
          pb: 4,
        }}
      >
        <CardContent>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              fontSize: "0.75rem",
              pb: 0.5,
            }}
          >
            ADD NEW NOTE
          </Typography>

          <Tiptap
            content=""
            setIsEdited={setIsEdited}
            setCanPost={setCanPost}
            setIsEditorEmpty={setIsEditorEmpty}
            getContent={setEditorContent}
            onPost={handlePost} // Skicka in handlePost-funktionen
          />
          {canPost && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlePost(editorContent)}
              disabled={!canPost}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "100%",
                borderRadius: 0,
              }}
            >
              PRESS CTRL+ENTER TO SAVE
            </Button>
          )}
        </CardContent>
      </ContentCard>
    </div>
  )
}

export default NewCard
