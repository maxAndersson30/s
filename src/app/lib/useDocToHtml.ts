import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import * as Y from "yjs";
import { yDocToProsemirrorJSON } from "y-prosemirror";
import { useDocument } from "dexie-react-hooks";
import { useMemo } from "react";

const extensions = [StarterKit];
const xmlFragmentName = "default";

export async function docToHtml(yDoc: Y.Doc | undefined): Promise<string> {
  if (!yDoc) return "";
  if (!yDoc.isLoaded) await yDoc.whenLoaded;
  const prosemirrorJSON = yDocToProsemirrorJSON(yDoc, xmlFragmentName);
  const html = generateHTML(prosemirrorJSON, extensions);
  return html;
}

export function useDocToHtml(yDoc: Y.Doc | undefined): string {
  useDocument(yDoc); // Loads the document
  if (!yDoc) return "";
  //if (!yDoc.isLoaded) throw yDoc.whenLoaded;
  const prosemirrorJSON = yDocToProsemirrorJSON(yDoc, xmlFragmentName);
  const html = generateHTML(prosemirrorJSON, extensions);
  return html;
}