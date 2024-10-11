"use client"

import { Box, CircularProgress, alpha, Chip } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import theme from "@/theme"
import {
  deleteCard,
  getCardById,
  updateCard,
  useLiveDataCards,
} from "../../db/db"
import Tiptap from "@/app/components/tiptap"
import { useEffect, useState } from "react"
import Masonry from "react-masonry-css"
import { useRouter, useSearchParams } from "next/navigation"
import NewCard from "@/app/components/new-card"
import { useSearch } from "../SearchContext"
import ItemCard from "@/app/components/item-card"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
}

export default function Everything() {
  const router = useRouter()
  const searchParams = useSearchParams() // Hämta query-parametrar
  const { searchKeyword } = useSearch()

  const cards = useLiveDataCards(searchKeyword)

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
        <NewCard />
        {cards.map((item, index) => (
          <ItemCard key={item.id} item={item} />
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
              minWidth: "300px",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                padding: 1,
                backgroundColor: alpha(theme.palette.text.primary, 0.05),
                borderRadius: "50%",
              }}
              onClick={() => {
                deleteCard(isModalEdit as string)
                router.push("/everything")
              }}
            >
              <DeleteOutlineIcon />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
