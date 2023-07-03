const { randomUUID } = require("crypto");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

const customMetadata = {
  creators: "signer1@gmail.com",
  created_at: new Date().getTime().toString(),
  cid: "QmZ",
  signers: [
    {
      email: "signer1@gmail.com",
      signed_at: new Date().getTime().toString(),
    },
    {
      email: "signer2@gmail.com",
      signed_at: new Date().getTime().toString(),
    },
  ],
};

async function loadPdf() {
  const pdfBytes = fs.readFileSync(process.cwd() + "/upload/" + "4c778cd5-c1d9-4709-9ca6-9106f621ef44.pdf");
  const pdfDoc = await PDFDocument.load(pdfBytes);
  return pdfDoc;
}
const uuid = randomUUID();

async function addMetadata() {
  const pdfBytes = fs.readFileSync(process.cwd() + "/upload/" + "4c778cd5-c1d9-4709-9ca6-9106f621ef44.pdf");
  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.setSubject(JSON.stringify(customMetadata));
  const pdfBytesWithMetadata = await pdfDoc.save();

  fs.writeFileSync(process.cwd() + "/upload/" + uuid + ".pdf", pdfBytesWithMetadata);
}

async function getMetadata() {
  const pdfBytes = fs.readFileSync(process.cwd() + "/upload/" + uuid + ".pdf");
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const metadata = pdfDoc.getSubject();

  console.log(JSON.parse(metadata));
}

async function main() {
  await addMetadata();
  await getMetadata();
}
main();
