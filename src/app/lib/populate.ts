import dayjs from "dayjs"
import { ICard, db } from "../db/db"
import { v4 as uuid } from "uuid"

const cardItems = [
  {
    id: uuid(),
    type: "text",
    description: `
        <p><b>Dexie</b> stands tall, a database so light,<br /> 
        With <b>Dexie Cloud</b>, your data takes flight.<br />
        Fast and robust, it scales with ease,<br />
        Syncing your apps like a summer breeze.</p>
        <p></p>
        <p>From offline to cloud, no data's lost,<br />
        A developer's dream, worth every cost.<br />
        <b>Dexie</b>, the hero, we trust with pride,<br />
        In <b>Dexie Cloud</b>, our data will ride.</p>
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
    content: ["https://unsplash.it/200"],
    description: "Real Estate",
    createdAt: dayjs().subtract(4, "day").toISOString(),
  },
  {
    id: uuid(),
    type: "image",
    content: ["https://loremflickr.com/200/200"],
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
