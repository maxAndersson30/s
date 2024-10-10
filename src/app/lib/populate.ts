import dayjs from "dayjs"
import { ICard, db } from "../db/db"
import { v4 as uuid } from "uuid"

const cardItems = [
  {
    id: uuid(),
    type: "text",
    description: `
        Dexie stands tall, a database so light,  
        With Dexie Cloud, your data takes flight.  
        Fast and robust, it scales with ease,  
        Syncing your apps like a summer breeze.  

        From offline to cloud, no data's lost,  
        A developer's dream, worth every cost.  
        Dexie, the hero, we trust with pride,  
        In Dexie Cloud, our data will ride.
    `,
    createdAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: uuid(),
    type: "image",
    content: ["https://picsum.photos/200"],
    description: "Eames Lounge Chair",
    createdAt: dayjs().subtract(2, "day").toISOString(),
  },
  {
    id: uuid(),
    type: "text",
    description:
      "It's not what we don't know that gets us in trouble. It's what we know for sure that just ain't so.",
    createdAt: dayjs().subtract(3, "day").toISOString(),
  },
  {
    id: uuid(),
    type: "image",
    content: "https://unsplash.it/200",
    description: "Real Estate",
    createdAt: dayjs().subtract(4, "day").toISOString(),
  },
  {
    id: uuid(),
    type: "image",
    content: "https://loremflickr.com/200/200",
    description: "Furniture: Eames Lounge Chair",
    createdAt: dayjs().subtract(5, "day").toISOString(),
  },
] as ICard[]

export async function populate() {
  if ((await db.card.count()) === 0) {
    console.log("Populating the database with initial data")
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
}
