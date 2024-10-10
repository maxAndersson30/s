"use client"

import Dexie, { Table } from "dexie"
import dexieCloud from "dexie-cloud-addon"
import qs from "qs"

interface Card {
  id: string
  type: "image" | "note" | "quote" | "checklist"
  content?: string[]
  title?: string
  price?: string
  author?: string
  description?: string
  createdAt?: Date
  createdBy?: string
  updatedAt?: Date
  updatedBy?: string
  isDeleted?: boolean
  deletedAt?: Date
  deletedBy?: string
  realmId?: string
  owner?: string
}

export class DexieStarter extends Dexie {
  card!: Table<Card, string>

  constructor() {
    super("DexieStarter", { addons: [dexieCloud] })

    this.version(1).stores({
      card: `
          id, type, *content, title, price, author, description, createdAt, createdBy, updatedAt, updatedBy, isDeleted, deletedAt, deletedBy, realmId, owner`,
      setting_local: "++id, key, value",
    })
  }
}

let db: DexieStarter

try {
  db = new DexieStarter()
  console.log("Database initialized successfully")
} catch (error) {
  error
  console.error("Failed to initialize the database:", error)

  // Kontrollera om error är en instans av Error
  let errorMessage = "An error occurred while initializing the database."

  if (error instanceof Error) {
    errorMessage += `\nDetails: ${error.message}`
    if (error.stack) {
      errorMessage += `\nStack trace: ${error.stack}`
    }
  } else {
    // Om det är något annat än en Error, konvertera det till en sträng
    errorMessage += `\nDetails: ${String(error)}`
  }

  // Visa felmeddelandet med stacken i en alert
  alert(errorMessage)

  // Sätt db till null eller vidta andra åtgärder
  db = null as any
}

const query =
  typeof window !== "undefined"
    ? qs.parse(window.location.search, { ignoreQueryPrefix: true })
    : {}

// Konfiguration av Dexie Cloud
const configureDexieCloud = () => {
  try {
    const configure = db.cloud.configure({
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
    console.log("Dexie Cloud configured successfully", configure)
  } catch (error) {
    let errorMessage =
      "An unknown error occurred during Dexie Cloud configuration."
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Failed to configure Dexie Cloud:", errorMessage)
  }
}

// Hantering av första gångens databaspopulation
const handleFirstTimePopulate = async (initdb: DexieStarter) => {
  try {
    initdb.cloud.events.syncComplete.subscribe(async () => {
      try {
        if (initdb.cloud.currentUserId !== "unauthorized") {
          const populated = await initdb.card.count()
          if (populated === 0) {
            // await populate()
            console.log("Database populated for the first time.")
          }
        } else {
          console.log("Unauthorized user detected during sync.")
        }
      } catch (error) {
        let errorMessage =
          "An error occurred during syncComplete event handling."
        if (error instanceof Error) {
          errorMessage = error.message
        }
        console.error("Error during syncComplete event handling:", errorMessage)
      }
    })
  } catch (error) {
    let errorMessage = "Failed to subscribe to syncComplete event."
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error(errorMessage, error)
  }
}

// Initiering av databasen
const initializeDatabase = async () => {
  try {
    configureDexieCloud()

    db.on("ready", () => handleFirstTimePopulate(db))

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
