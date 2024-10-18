import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

export const commonTiptapExtensions = [
  StarterKit,
  CodeBlockLowlight.configure({
    lowlight: createLowlight(common),
    defaultLanguage: null,
  }),
];
Object.freeze(commonTiptapExtensions);
