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

const base64_signature = "";

const uuid = randomUUID();

async function readFile() {
  const pdfBytes = fs.readFileSync(process.cwd() + "/upload/" + "4c778cd5-c1d9-4709-9ca6-9106f621ef44.pdf");
  const pdfDoc = await PDFDocument.load(pdfBytes);
  return pdfDoc;
}

async function addMetadata(pdfDoc, metadata) {
  pdfDoc.setSubject(JSON.stringify(metadata));
  return await pdfDoc.save();
}

async function getMetadata(pdfDoc) {
  const metadata = pdfDoc.getSubject();
  console.log("get metadat", JSON.parse(metadata));
  return JSON.parse(metadata);
}

async function ipfs() {
  // save to ipfs
  const pdfBytes = fs.readFileSync(process.cwd() + "/upload/" + "4c778cd5-c1d9-4709-9ca6-9106f621ef44.pdf");
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
}

module.exports = {
  addMetadata,
  getMetadata,
};
