require("dotenv").config();
const ethers = require("ethers");
const { formatError } = require("ethers/lib/utils");
const chai = require("chai");
const web3 = require("web3");
const ABI = require("../build/DocumentFactory.json").abi;
const CONTRACT_ADDRESS = require("../build/DocumentFactory.json").address;
const sha256 = require("../utils/sha256");

const PRIVATE_KEY = "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1";
const PUBLIC_KEY = process.env.ADDRESS;

const PROVIDER = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const WALLET = new ethers.Wallet(PRIVATE_KEY, PROVIDER);
const CONTRACT = new ethers.Contract(CONTRACT_ADDRESS, ABI, WALLET);

// describe("Get Owner", () => {
//   it("should return the owner of the contract", async () => {
//     const owner = await CONTRACT.owner();
//     console.log(">>>> Get owner:", owner);
//     chai.expect(owner).to.equal(PUBLIC_KEY);
//   });
// });

// describe("Get balance", () => {
//   it("should return the balance of the contract", async () => {
//     const balance = await WALLET.getBalance();
//     console.log(">>>> Get balance:", balance.toString());
//     chai.expect(true).to.equal(true);
//   });
// });

// describe("Document already exits", () => {
//   it("It should return D403", async () => {
//     try {
//       const sha = sha256.getHash("test1");
//       const byte32 = ethers.utils.hexZeroPad(sha, 32);
//       const contractWithSigner = contract.connect(wallet);
//       const tx = await contractWithSigner.createDocument_test(byte32, {
//         gasLimit: 1000000,
//       });
//       await tx.wait();
//     } catch (error) {
//       console.error("Document already exits Error:", JSON.stringify(error,null,1));
//       chai.expect(error.error.data.reason).to.equal("D403");
//     }
//   });
// });

// describe("Document Not Found", () => {
//   it("It should return D404", async () => {
//     try {
//       const sha = sha256.getHash("UNKNOWN");
//       const byte32 = ethers.utils.hexZeroPad(sha, 32);
//       const document = await contract.getDocument(byte32);
//     } catch (error) {
//       console.error("Document Not Found Error:", JSON.stringify(error,null,1));
//       const expectedCode = web3.utils.hexToAscii("0x" + error.error.error.data.substring(138, 138 + 64)).replace(/\u0000/g, "");
//       chai.expect(expectedCode.toString()).to.equal("D404");
//     }
//   });
// });

describe("Get document", () => {
  it("It should get a document", async () => {
    try {
      const sha = sha256.getHash("test1");
      const byte32 = ethers.utils.hexZeroPad(sha, 32);
      const document = await contract.getDocument_test(byte32);
      console.log(">>>> Get document:", document);
      chai.expect(true).to.equal(true);
    } catch (error) {
      throw error;
    }
  });
});
