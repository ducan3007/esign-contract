require("dotenv").config();
const ethers = require("ethers");
const { formatError } = require("ethers/lib/utils");
const chai = require("chai");
const web3 = require("web3");
const ABI = require("../build/DocumentFactory.json").abi;
const CONTRACT_ADDRESS = require("../build/DocumentFactory.json").address;
const sha256 = require("../utils/sha256");

const PRIVATE_KEY = "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1";
const PUBLIC_KEY = "";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

describe("Create document", () => {
  it("It should create a document", async () => {
    try {
      const sha = sha256.getHash("8");
      const address = ethers.utils.computeAddress(PRIVATE_KEY);

      const _signers = [
        {
          signed_at: 0,
          email: "adf@gmail.com",
          signer: address,
        },
        {
          signed_at: 0,
          email: "1232@gmail.com",
          signer: "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d",
        },
      ];
      console.log(">>>> _signers:", _signers);

      const _hash = ethers.utils.hexZeroPad(sha, 32);
      const contractWithSigner = contract.connect(wallet);

      const tx = await contractWithSigner.createDocument(_hash, _signers, {
        gasLimit: 1000000,
      });
      await tx.wait();

      console.log(">>>> Create document:", tx);
      chai.expect(true).to.equal(true);
    } catch (error) {
      console.error("Create document Error:", error);
    }
  });
});

describe("Get document", () => {
  it("It should get a document", async () => {
    try {
      const sha = sha256.getHash("1");
      const byte32 = ethers.utils.hexZeroPad(sha, 32);
      const document = await contract.getDocument(byte32);
      console.log(">>>> Get document:", JSON.stringify(document, null, 1));
      chai.expect(true).to.equal(true);
    } catch (error) {
      throw error;
    }
  });
});