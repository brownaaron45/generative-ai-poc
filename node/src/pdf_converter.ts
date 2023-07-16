/**
 * Extracts text from a PDF file stored in memory as a buffer.
 *
 * @param {Buffer} pdfBuffer - A buffer containing the contents of a PDF file.
 *
 * @return {Promise<any>} - A promise that resolves with the extracted data
 *    when the parsing is complete.
 */
export async function extractTextFromPDFBuffer(pdfBuffer: Buffer) {
  const PDFParser = (await import("pdf2json")).default;
  const pdfParser = new PDFParser();

  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", (pdfData) => resolve(pdfData));
    pdfParser.parseBuffer(pdfBuffer);
  });
}
