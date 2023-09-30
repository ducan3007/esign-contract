require("dotenv").config();
const ethers = require("ethers");
const { formatError } = require("ethers/lib/utils");
const chai = require("chai");
const web3 = require("web3");
const ABI = require("../build/DocumentFactory.json").abi;
const CONTRACT_ADDRESS = require("../build/DocumentFactory.json").address;
const sha256 = require("../utils/sha256");

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

const PRIVATE_KEY = "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1";
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

const _wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const _contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, _wallet);
const file = "12345789";

// describe("Create document", () => {
//   it("It should create a document", async () => {
//     try {
//       const sha = sha256.getHash(file);
//       const _signers = [
//         {
//           signed_at: 0,
//           email: "lordmasterking001@gmail.com",
//           signing_address: "0x0000000000000000000000000000000000000000",
//         },
//         {
//           signed_at: 0,
//           email: "anducnguyen3007@gmail.com",
//           signing_address: "0x0000000000000000000000000000000000000000",
//         },
//       ];
//       console.log(">>>> _signers:", _signers);

//       const _hash = ethers.utils.hexZeroPad(sha, 32);
//       console.log(">>>> _hash:", _hash);
//       const contractWithSigner = _contract.connect(_wallet);
//       const tx = await contractWithSigner.createDocument(_hash, _signers, {
//         gasLimit: 10000000,
//       });
//       console.log(">>> raw tx", tx);
//       await tx.wait().then((receipt) => {
//         console.log(">>>> receipt:", receipt);
//       });

//       console.log(">>>> Create document:", tx);
//       chai.expect(true).to.equal(true);
//     } catch (error) {
//       chai.expect(error?.error?.data?.reason).to.equal("D403");
//       console.error("Document already exits Error:", error?.error?.data?.reason);
//     }
//   });
// });

describe("Add signer email", () => {
  it("It should add signer email", async () => {
    try {
      const address = ["0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9", "0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E"];
      const email = "lordmasterking01@gmail.com";
      const contractWithSigner = _contract.connect(_wallet);

      const tx = await contractWithSigner.updateSignerAddresses(email, address, {
        gasLimit: 1000000,
      });
      await tx.wait().then((receipt) => {
        console.log(">>>> receipt:", receipt);
      });

      const signer_address = await _contract.getSignerAddresses(email);
      console.log(">>>> signer_address:", signer_address);
    } catch (error) {
      console.error("Add signer error:", JSON.stringify(error, null, 1));
    }
  });
});

// describe("Sign document", () => {
//   it("It should sign a document", async () => {
//     try {
//       const email = "adf@gmail.com";
//       const signer_address = await contract.getSignerAddresses(email);

//       console.log(">>>> signer_address:", signer_address);

//       const sha = sha256.getHash(file);
//       const byte32 = ethers.utils.hexZeroPad(sha, 32);
//       const contractWithSigner = contract.connect(wallet);
//       const tx = await contractWithSigner.signDocument(byte32, email, {
//         gasLimit: 1000000,
//       });
//       await tx.wait().then((receipt) => {
//         console.log(">>>> receipt:", receipt);
//       });
//       console.log(">>>> Sign document:", tx);
//       chai.expect(true).to.equal(true);
//     } catch (error) {
//       console.error("Document Not Found Error:", JSON.stringify(error, null, 1));
//       const expectedCode = error.error.data.reason;
//       console.log(">>>> expectedCode:", expectedCode === "D404");
//       chai.expect(expectedCode.toString()).to.equal("D404");
//       // throw error;
//     }
//   });
// });
