import { supportedExtensions } from "../model/supportedExtensions";
import path from "path";

const extensions = new Set(supportedExtensions);
export const checkFile = (fileName: string): boolean => {
  const fileExtension = path.extname(fileName);
  return extensions.has(fileExtension);
};
