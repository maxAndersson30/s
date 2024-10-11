"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import { CSSProperties, useEffect, useRef } from "react"

interface EditorProps {
  content?: string
  style?: CSSProperties
  setIsEdited: (edited: boolean) => void
  setCanPost: (canPost: boolean) => void
  setIsEditorEmpty: (isEmpty: boolean) => void
  getContent: (content: string) => void
  onPost: (content: string) => void // Ny funktion som triggas vid post
  setEditor: (editor: any) => void // Ny prop för att skicka ut editor-instansen
}

const Tiptap = ({
  content = "",
  style,
  setIsEdited,
  setCanPost,
  setIsEditorEmpty,
  getContent,
  onPost,
  setEditor, // Mottag setEditor-funktionen
}: EditorProps) => {
  const initialContent = useRef(content)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
    ],
    content: content,
    editorProps: {
      handleKeyDown(view: any, event: any) {
        // Kolla om Cmd+Enter eller Ctrl+Enter har tryckts
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
          if (editor && !editor.isEmpty) {
            // Anropa onPost och skicka det aktuella innehållet
            onPost(editor.getHTML())
          }

          editor.commands.setContent("")

          event.preventDefault() // Förhindra standardbeteendet
          return true
        }
        return false
      },
    },
    onUpdate() {
      if (editor) {
        const isEditorEmpty = editor.isEmpty
        setIsEditorEmpty(isEditorEmpty)

        // Jämför nuvarande innehåll med initialContent
        const currentContent = editor.getHTML()
        const isModified = currentContent !== initialContent.current

        setIsEdited(isModified)
        setCanPost(!isEditorEmpty && isModified)

        // Skicka innehållet till föräldrakomponenten
        getContent(currentContent)
      }
    },
  })

  useEffect(() => {
    if (editor) {
      if (setEditor) setEditor(editor)
    }
  }, [editor, setEditor])

  return <EditorContent editor={editor} style={style} />
}

export default Tiptap
