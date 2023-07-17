import express from "express";
import multer from "multer";
import {extractTextFromPDFBuffer} from "./pdf_converter";
import {summarizeText} from "./text_summarizer";
import {Page, Text} from "./third-party-types/pdf2json-types";

const app = express();
const port = 3000;

const upload = multer({storage: multer.memoryStorage()});

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Routes
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello, World!");
});


app.post("/summarize", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({error: "No file was uploaded"});
      return;
    }

    const pdfBuffer = req.file.buffer;
    const pdfData = await extractTextFromPDFBuffer(pdfBuffer);

    const pages = pdfData.Pages;
    let combinedText = "";
    pages.forEach((page: Page, pageIndex: number) => {
      page.Texts.forEach((text: Text) => {
        const decodedText = decodeURIComponent(text.R[0].T);
        combinedText += decodedText;
        if (decodedText.includes("search term")) {
          console.log(`Found text on page ${pageIndex + 1}: ${decodedText}`);
        }
      });
    });

    if (combinedText.length === 0) {
      res.status(500).json({error: "No text found in pdf"});
      return;
    }

    const summary = await summarizeText(combinedText);
    res.status(200).send(summary);
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
