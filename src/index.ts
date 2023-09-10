import readline from "readline";
import fs from "fs";
import sharp from "sharp";
import { checkFile } from "./service/fileExtensionChecker";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the folder path: ", (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    console.log("Folder does not exist!");
    rl.close();
    return;
  }

  const files = fs.readdirSync(folderPath).filter(checkFile);

  console.log(
    "\x1b[33m",
    `Found ${files.length} files in ${folderPath}`,
    "\x1b[0m"
  );
  if (files.length < 1) {
    console.log("\x1b[31m", "No files to process!", "\x1b[0m");
    rl.close();
    return;
  }
  const outFolderPath = `${folderPath}/out`;
  fs.mkdirSync(outFolderPath, { recursive: true });

  console.log(`Created folder ${outFolderPath}`);

  files.forEach(async (file) => {
    const filePath = `${folderPath}/${file}`;
    const outFilePath = `${outFolderPath}/${
      file.lastIndexOf(".") > -1
        ? file.substring(0, file.lastIndexOf("."))
        : file
    }`;
    const convertedImage = sharp(filePath).webp({ quality: 80 });
    convertedImage.toFile(`${outFilePath}.webp`, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Converted ${file} to ${outFilePath}`);
      }
    });
    const imageWidth = (await convertedImage.metadata()).width ?? 0;
    if (imageWidth > 400) {
      const resizedImage = sharp(filePath).resize(400);
      resizedImage.toFile(`${outFilePath}-400.webp`, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Converted ${file} to ${outFilePath}-400`);
        }
      });
    }
  });

  rl.close();
});
