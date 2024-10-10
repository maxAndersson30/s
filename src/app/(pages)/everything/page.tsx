"use client"

import styled from "@emotion/styled"
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  alpha,
} from "@mui/material"
import Dialog, { DialogProps } from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import theme from "@/theme"
import {
  createCard,
  getCardById,
  ICard,
  updateCard,
  useLiveDataCards,
} from "../../db/db"
import Tiptap from "@/app/components/tiptap"
import { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import dayjs from "dayjs"
import { v4 as uuid } from "uuid"
import Masonry from "react-masonry-css"
import { useRouter, useSearchParams } from "next/navigation"
import NewCard from "@/app/components/new-card"

export const ContentCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "3px 10px 37px -4px rgba(42, 52, 68, 0.5)",
})

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
}

export default function Everything() {
  const router = useRouter()
  const searchParams = useSearchParams() // Hämta query-parametrar
  const [isModalEdit, setIsModalEdit] = useState<string | undefined>(undefined)

  const [isEdited, setIsEdited] = useState(false)
  const [canPost, setCanPost] = useState(false)
  const [isEditorEmpty, setIsEditorEmpty] = useState(true)
  const [editorContent, setEditorContent] = useState("")

  useEffect(() => {
    async function getEditorContent(id: string) {
      const card = await getCardById(id)
      setEditorContent(card?.description as string)
      setIsModalEdit(id)
    }
    const modalParam = searchParams.get("edit")

    if (modalParam != undefined) {
      getEditorContent(modalParam)
    } else {
      setIsModalEdit(undefined)
    }
  }, [searchParams])

  const cards = useLiveDataCards()

  const closeModal = () => {
    setIsModalEdit(undefined)
    router.push("/everything")
  }

  // Funktion som körs när Ctrl+Enter eller Cmd+Enter trycks
  const handlePost = (content: string) => {
    if (!isModalEdit) return

    updateCard(isModalEdit, content)
    setEditorContent("")
    setCanPost(false)
    setIsEdited(false)
    setIsEditorEmpty(true)
    router.push("/everything")
  }

  if (!cards || cards.length === 0) {
    return <CircularProgress />
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <div>
          <NewCard />
        </div>
        {cards.map((item, index) => (
          <div key={index}>
            <ContentCard
              onClick={() => {
                router.push(`/everything?edit=${item.id}`)
              }}
            >
              {item?.type === "text" && (
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    <div
                      className="editor-content"
                      dangerouslySetInnerHTML={{
                        __html: item?.description as string,
                      }}
                    />
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
          </div>
        ))}
      </Masonry>
      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={isModalEdit != undefined}
        onClose={closeModal}
        PaperProps={{
          style: {
            minHeight: "90%",
            maxHeight: "90%",
            minWidth: "90%",
            maxWidth: "90%",
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            height: "100%",
          }}
        >
          <Box
            sx={{
              flexGrow: 1, // Tar upp allt återstående utrymme
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tiptap
              content={editorContent}
              setIsEdited={setIsEdited}
              setCanPost={setCanPost}
              setIsEditorEmpty={setIsEditorEmpty}
              getContent={setEditorContent}
              onPost={handlePost}
              style={{
                minWidth: "810px",
              }}
            />
          </Box>
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.text.primary, 0.05),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "300px",
              borderRadius: 2,
            }}
          ></Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
