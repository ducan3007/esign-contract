const fs = require("fs");
const cryto = require("crypto");
const { PDFDocument } = require("pdf-lib");
const hummus = require("hummus");

const file = fs.readFileSync(process.cwd() + "/upload/" + "4c778cd5-c1d9-4709-9ca6-9106f621ef44.pdf");

function sha256(file) {
  const hash = cryto.createHash("sha256");
  hash.update(file);
  return hash.digest();
}


module.exports = {
  getHash: sha256,
};
