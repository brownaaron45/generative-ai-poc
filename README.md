# generative-ai-poc

This project demonstrates the ability to summarize uploaded documents, starting with PDFs. The text is extracted using the NodeJS library pdf2json and then summarized by ChatGPT 3.5-turbo, with a limit of approximately 500 characters. The project is open-source and utilizes Dart and NodeJS languages. Links to the libraries used are provided below.

* [Flutter](https://docs.flutter.dev/) for the UI/UX

* [ExpressJS](https://expressjs.com/) for the application server

* [OpenAI](https://platform.openai.com/overview) for the generated summary

* [PDF-2-JSON](https://www.npmjs.com/package/pdf2json) to extract the text from the pdf.

* [PDF Render](https://pub.dev/packages/pdf_render) to render the pdf in the UI (PDF.js).

* [TesseractOCR](https://github.com/tesseract-ocr/tesseract) to extract text from PNG, JPEG, or TIFF files. (not implemented here)

## [View the Demo](./docs/generative-ai-poc-demo.gif)

![Generative AI POC Demo](./docs/generative-ai-poc-demo.gif)
The [document](./docs/Ensuring_Regulatory_Compliance.pdf) in the demo

## Running for Yourself

Navigate to `flutter` directory and run the program using the flutter command. Alternatively use VS Code and execute the main.dart file upon opening in the editor. Next run the ExpressJS server using `npm start` in the `node` directory.
