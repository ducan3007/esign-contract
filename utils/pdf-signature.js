const { addMetadata } = require("./pdf-lib");
const { randomUUID } = require("crypto");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

const signatureBase64 = "";

async function readFile() {
  const pdfBytes = fs.readFileSync(process.cwd() + "/upload/" + "4c778cd5-c1d9-4709-9ca6-9106f621ef44.pdf");
  const pdfDoc = await PDFDocument.load(pdfBytes);
  return pdfDoc;
}

async function readSignature() {
  const signatureBytes = fs.readFileSync(process.cwd() + "/upload/" + "signature.png");
  return signatureBytes;
}

async function addSignature(pdfDoc, signatureBase64) {
  const position = { x: 100, y: 100 };
  const size = { width: 150, height: 100 };
  const signature = await pdfDoc.embedPng(signatureBase64);
  const page = pdfDoc.getPage(0);
  page.drawImage(signature, {
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
  });
  return pdfDoc;
  
}


async function main() {
  const pdfDoc = await readFile();
  const signatureBytes = await readSignature();
  const signatureBase64 = signatureBytes.toString("base64");
  const pdfDocWithSignature = await addSignature(pdfDoc, signatureBase64);
  const pdfBytes = await pdfDocWithSignature.save();
  fs.writeFileSync(process.cwd() + "/upload/" + randomUUID() +".pdf", pdfBytes);
}

main();
