"use client"

import Dexie, { Table } from "dexie"
import dexieCloud from "dexie-cloud-addon"
import qs from "qs"
import { populate } from "../lib/populate"
import { useLiveQuery } from "dexie-react-hooks"

export interface ICard {
  id: string
  type: "image" | "text"
  content?: string[]
  description?: string
  createdAt: string
  realmId?: string
  owner?: string
}

export class DexieStarter extends Dexie {
  card!: Table<ICard, string>

  constructor() {
    super("DexieStarter", { addons: [dexieCloud] })

    this.version(1).stores({
      card: `id, type, *content, description, createdAt, realmId, owner`,
      setting_local: "++id, key, value",
    })
  }
}

export const useLiveDataCards = (): ICard[] => {
  const cards = useLiveQuery(async () => {
    try {
      return await db.card.toArray()
    } catch (e) {
      return []
    }
  }, []) as ICard[]

  return cards?.sort((a, b) => b.createdAt?.localeCompare(a.createdAt)) || []
}

let db: DexieStarter

try {
  db = new DexieStarter()
  console.log("Database initialized successfully")
} catch (error) {
  console.error("Failed to initialize the database:", error)
}

const query =
  typeof window !== "undefined"
    ? qs.parse(window.location.search, { ignoreQueryPrefix: true })
    : {}

// Konfiguration av Dexie Cloud
const configureDexieCloud = () => {
  try {
    db.cloud.configure({
      databaseUrl:
        process.env.NEXT_PUBLIC_DEXIE_CLOUD_DB_URL ||
        "https://your-dexie-db.dexie.cloud",
      requireAuth: {
        email: query.email?.toString(),
        otpId: query.otpId?.toString(),
        otp: query.otp?.toString(),
      },
      customLoginGui: true,
      unsyncedTables: ["setting_local"],
    })
    console.log("Dexie Cloud configured successfully")
  } catch (error) {
    console.error(error)
  }
}

const initializeDatabase = async () => {
  try {
    configureDexieCloud()

    db.on("blocked", (blocked: any) => {
      const errorMessage =
        "Database upgrade blocked. Please close other open tabs using this app."
      console.error(errorMessage, blocked)
    })

    console.log("Database initialized and ready event subscribed.")
  } catch (error) {
    let errorMessage = "Failed to initialize the database."
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error(errorMessage, error)
  }
}

// Starta databasen om vi är i en webbläsarmiljö
if (typeof window !== "undefined") {
  initializeDatabase()
}

// Exportera databasens namn och instans
export const dbName = "dexie-starter"

export { db }
