import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { addImageToCard, createCard } from '../db/db' // Import your database function
import * as Y from 'yjs' // Import Yjs library
import { v4 as uuid } from 'uuid' // Import uuid for generating cardId

const MyDropzone = () => {
  const [cardId, setCardId] = useState<string | null>(null) // Store the cardId

  const handleOnDrop = async (acceptedFiles: File[]) => {
    if (!cardId) {
      // Create a new card if one doesn't exist yet for this image upload
      const newCardId = uuid() // Generate unique ID for the card
      setCardId(newCardId) // Set the cardId in state

      // Create a placeholder card in the db, so that we have a cardId
      try {
        await createCard({
          id: newCardId,
          createdAt: new Date().toISOString(),
          title: 'New Card',
          doc: new Y.Doc(),
          fullTextIndex: [],
        })
      } catch (error) {
        console.error('Error creating card:', error)
        return // Stop the upload if card creation fails
      }
    }

    for (const file of acceptedFiles) {
      try {
        if (cardId) {
          await addImageToCard(cardId, file) // Save the image
        } else {
          console.error('Card ID is null')
        }
        console.log('Image saved successfully:', file.name)
      } catch (error) {
        console.error('Error saving image:', error)
        // Handle the error appropriately, e.g., display an error message
      }
    }
  }

  return (
    <Dropzone onDrop={handleOnDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag n drop some files here, or click to select files</p>
          </div>
        </section>
      )}
    </Dropzone>
  )
}

export default MyDropzone
