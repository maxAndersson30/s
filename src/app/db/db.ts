"use client";

import Dexie, { Table } from "dexie";
import dexieCloud, { defineYDocTrigger } from "dexie-cloud-addon";
import { useLiveQuery } from "dexie-react-hooks";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import { docToHtml } from "../lib/docToHtml";
import { debounce } from "lodash";
import { extractLunrKeywords } from "./search";
import { query } from "../lib/query";

export interface ICard {
  id: string;
  type: "image" | "text" | "document";
  createdAt: string;
  content?: string[];
  doc: Y.Doc;
  docHtml?: string;
  fullTextIndex: string[];
  description?: string;
  realmId?: string;
  owner?: string;
}

export class DexieStarter extends Dexie {
  card!: Table<ICard, string>;

  constructor() {
    super("DexieStarter", {
      Y,
      //gc: false,
      addons: [dexieCloud],
    });

    this.version(1).stores({
      card: `
        id,
        *fullTextIndex,
        doc:Y`,
      setting_local: "++id, key",
    });

    // A trigger to set the docHtml string attribute from Y.Doc content
    defineYDocTrigger(this.card, "doc", async (ydoc, parentId) => {
      console.log("Triggered", ydoc, parentId);
      const html = docToHtml(ydoc as any);
      await this.card.update(parentId, {
        docHtml: html,
        fullTextIndex: extractLunrKeywords(html),
      });
      //updateFullTextIndex({ html }, parentId);
    });

    // A 5-seconds debounced function to update the full text search index
    const updateFullTextIndex = debounce(({ html, image }, parentId) => {
      if (html) {
        this.card.update(parentId, {
          fullTextIndex: extractLunrKeywords(html),
        });
      }
    }, 5000);

    this.cloud.configure({
      databaseUrl:
        process.env.NEXT_PUBLIC_DEXIE_CLOUD_DB_URL ||
        "https://your-dexie-db.dexie.cloud",

      // List tables that are local only:
      unsyncedTables: ["setting_local"],
      // Let computed properties be local only (for faster searching and rendering of docuemnts)
      // These properties are computed locally using defineYDocTrigger() above.
      unsyncedProperties: {
        card: [
          "docHtml", // docHtml is a locally computed HTML version of doc
          "fullTextIndex", // fullTextIndex is the searchable lunr words extracted from docHtml
        ] satisfies (keyof ICard)[], // ('satisfies' gives us stricter typings for the property names in the list)
      },

      // Enable Y.js awareness
      awarenessProtocol,

      // Enable custom login GUI
      customLoginGui: true,

      // Require authentication and allow magic email links to auto-login user
      requireAuth: {
        email: query.email?.toString(),
        otpId: query.otpId?.toString(),
        otp: query.otp?.toString(),
      },
    });
  }
}

export const createCard = async (card: ICard) => {
  try {
    await db.card.add(card);
  } catch (e) {
    console.error(e);
  }
};

export const updateCard = async (id: string, content: string) => {
  try {
    await db.card.where("id").equals(id).modify({ description: content });
  } catch (e) {
    console.error(e);
  }
};

export const deleteCard = async (id: string) => {
  try {
    await db.card.where("id").equals(id).delete();
  } catch (e) {
    console.error(e);
  }
};

export const useLiveDataCards = (keyword: string): ICard[] => {
  console.log("useLiveDataCards", keyword);
  const cards = useLiveQuery(async () => {
    try {
      if (!keyword) return await db.card.limit(50).toArray();

      const keywords = extractLunrKeywords(keyword);
      if (keywords.length === 0) return [];
      console.log("lunr keywords", keywords);

      if (keywords.length === 1) {
        // One keyword search:
        const results = await db.card
          .where("fullTextIndex")
          .startsWith(keywords[0])
          .limit(50)
          .toArray();
        return results
          .flat()
          .filter((o, i, a) => a.findIndex((t) => t.id === o.id) === i);
      } else {
        // Multi-keyword search.
        // 1) Get all primary keys for each keyword
        const results = await Promise.all(
          keywords.map((keyWord) =>
            db.card.where("fullTextIndex").startsWith(keyWord).primaryKeys()
          )
        );
        // 2) Find the intersection of all primary keys
        const intersection = results.reduce((a, b) => {
          const set = new Set(b);
          return a.filter((k) => set.has(k));
        });
        // 3) Get the cards for the intersection (max 50 cards)
        return await db.card.bulkGet(intersection.slice(0, 50));
      }
    } catch (e) {
      return [];
    }
  }, [keyword]) as ICard[];

  return cards?.sort((a, b) => b.createdAt?.localeCompare(a.createdAt)) || [];
};

export const getCardById = async (id: string): Promise<ICard | undefined> => {
  try {
    return await db.card.where("id").equals(id).first();
  } catch (e) {
    return;
  }
};

let db: DexieStarter;

try {
  db = new DexieStarter();
  console.log("Database initialized successfully");
} catch (error) {
  console.error("Failed to initialize the database:", error);
}

const initializeDatabase = async () => {
  try {
    db.on("blocked", (blocked: any) => {
      const errorMessage =
        "Database upgrade blocked. Please close other open tabs using this app.";
      console.error(errorMessage, blocked);
    });

    console.log("Database initialized and ready event subscribed.");
  } catch (error) {
    let errorMessage = "Failed to initialize the database.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage, error);
  }
};

// Starta databasen om vi är i en webbläsarmiljö
if (typeof window !== "undefined") {
  initializeDatabase();
}

// Exportera databasens instans
export { db };
