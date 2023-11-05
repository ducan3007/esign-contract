require("dotenv").config();
const ethers = require("ethers");
const chai = require("chai");

const ABI = require("../build/CertificateFactory.json").abi;
const CONTRACT_ADDRESS = require("../build/CertificateFactory.json").address;
const sha256 = require("../utils/sha256");

const PROVIDER = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const WALLET = new ethers.Wallet(process.env.PRIVATE_KEY, PROVIDER);
const CONTRACT = new ethers.Contract(CONTRACT_ADDRESS, ABI, WALLET);

let cert = "1234157189w10";
let sha = sha256.getHash(cert);
let contract = CONTRACT.connect(WALLET);

describe("Create Cert", () => {
  it("It should create a certificate", async () => {
    try {
      const tx = await contract.createCert(sha, { gasLimit: 1000000 });
      let receipt = await tx.wait();
    } catch (error) {
      console.error("[Cert Error:]", error?.error?.data?.reason);
    }
  });
});

describe("Issue Cert", () => {
  it("It should issue cert", async () => {
    try {
      let cert_hash = sha256.getHash("cert_hash");

      const candidate = {
        status: "ISSUED",
        cert_hash: cert_hash,
        name: "Nguyen Van A",
        issuer: "0x0000000000000000000000000000000000000000",
        email: "andfa@gmail.com",
        issued_at: new Date().getTime(),
        expired_at: new Date().getTime() + 1000000,
      };

      const tx = await contract.issueCert(sha, candidate, { gasLimit: 5000000 });
    } catch (error) {
      console.error("[Cert Error:]", error);
    }
  });
});

// describe("Revoke Cert", () => {
//   it("It should issue cert", async () => {
//     try {
//       let cert_hash = sha256.getHash("cert_hash");

//       const candidate = {
//         status: "ISSUED",
//         cert_hash: cert_hash,
//         name: "Nguyen Van A",
//         email: "andfa@gmail.com",
//         issued_at: new Date().getTime(),
//         expired_at: new Date().getTime() + 1000000,
//       };

//       const tx = await contract.revokeCert(sha, "andfa@gmail.com", { gasLimit: 5000000 });
//     } catch (error) {
//       console.error("[Cert Error:]", error);
//     }
//   });
// });

function parseCandidate(tx) {
  let issued_at = tx[0].toNumber();
  let cert_hash = tx[1].toString();
  let issuer_address = tx[2].toString();
  let name = tx[3].toString();
  let email = tx[4].toString();
  let status = tx[5].toString();
  let expired_at = tx[6].toNumber();

  return {
    issued_at,
    cert_hash,
    issuer_address,
    name,
    email,
    status,
    expired_at,
  };
}

describe("Verify Cert", () => {
  it("It should verify a certificate", async () => {
    try {
      const tx = await contract.verifyCert(sha256.getHash("cert_hash"), { gasLimit: 5000000 });
      console.log(">>>> get_cert_tx: >>> ", JSON.stringify(tx, null, 1));

      let issued_at = tx[0].toNumber();
      let cert_hash = tx[1].toString();
      let issuer_address = tx[2].toString();
      let name = tx[3].toString();
      let email = tx[4].toString();
      let status = tx[5].toString();
      let expired_at = tx[6].toNumber();

      console.log({
        issued_at,
        cert_hash,
        issuer_address,
        name,
        email,
        status,
        expired_at,
      });
    } catch (error) {
      console.error("[Cert Error:]", error);
      console.error("[Cert Error:]", error?.error?.data?.reason);
    }
  });
});

describe("Cert Details", () => {
  it("It should return a cert detail", async () => {
    try {
      const tx = await contract.getCertDetails(sha, { gasLimit: 5000000 });
      let hash = tx[0].toString();
      let created_at = tx[1].toNumber();
      let candidates = tx[2];
      let candidate_temp = [];

      for (let i of candidates) {
        let candidate = parseCandidate(i);
        candidate_temp.push(candidate);
      }

      console.log({ hash, created_at, candidate_temp, hash2: sha.toString("hex") });
    } catch (error) {
      console.error("[Cert Error:]", error);
      console.error("[Cert Error:]", error?.error?.data?.reason);
    }
  });
});
