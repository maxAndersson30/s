import { ICard, db } from "../db/db"
import { v4 as uuid } from "uuid"

const cardItems = [
  { id: uuid(), type: "note", content: "Start typing here..." },
  {
    id: uuid(),
    type: "image",
    content: ["https://picsum.photos/200"],
    title: "Product Image",
    price: "$22",
    author: "Mark Twain",
    description: "Eames Lounge Chair",
  },
  {
    id: uuid(),
    type: "quote",
    content:
      "It's not what we don't know that gets us in trouble. It's what we know for sure that just ain't so.",
    author: "Mark Twain",
  },
  {
    id: uuid(),
    type: "image",
    content: "https://unsplash.it/200",
    title: "Real Estate",
    price: "$425,000",
  },
  {
    id: uuid(),
    type: "checklist",
    content: ["Tokyo, Japan", "Venice, Italy", "New York, USA"],
  },
  {
    id: uuid(),
    type: "image",
    content: "https://loremflickr.com/200/200",
    title: "Furniture",
    description: "Eames Lounge Chair",
  },
] as ICard[]

export async function populate() {
  db.transaction("rw", db.card as any, () => {
    db.card
      .clear()
      .then(async () => {
        await db.card.bulkAdd(cardItems as any)
      })
      .then(() => {})
      .catch((err) => {
        console.error(err)
      })
  })
}
