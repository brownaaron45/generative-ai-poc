import express from "express";
import multer from "multer";
// eslint-disable-next-line spaced-comment
/// <reference path="../typings/pdf2json-types.d.ts" />
import {Page, Text} from "pdf2json-types";
import {extractTextFromPDFBuffer} from "./pdf_converter";

const app = express();
const port = 3000;

const upload = multer({storage: multer.memoryStorage()});

// Middleware
app.use(express.json());

// Routes
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello, World!");
});


app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({error: "No file was uploaded"});
      return;
    }

    const pdfBuffer = req.file.buffer;
    const pdfData = await extractTextFromPDFBuffer(pdfBuffer);

    const pages = pdfData.Pages;
    pages.forEach((page: Page, pageIndex: number) => {
      page.Texts.forEach((text: Text) => {
        const decodedText = decodeURIComponent(text.R[0].T);
        if (decodedText.includes("search term")) {
          console.log(`Found text on page ${pageIndex + 1}: ${decodedText}`);
        }
      });
    });

    res.json(pdfData);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({error: err.message});
    } else {
      res.status(500).json({error: "An unknown error occurred"});
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
