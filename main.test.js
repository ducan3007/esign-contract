require("dotenv").config();
const ethers = require("ethers");
const { formatError } = require("ethers/lib/utils");
const chai = require("chai");
const ABI = require("./build/DocumentFactory.json").abi;
const CONTRACT_ADDRESS = require("./build/DocumentFactory.json").address;
const sha256 = require("./utils/sha256");

const PRIVATE_KEY = "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1";
const PUBLIC_KEY = process.env.ADDRESS;

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

async function createDoc() {
  const sha = sha256.getHash("test224");
  const byte32 = ethers.utils.hexZeroPad(sha, 32);
  const contractWithSigner = contract.connect(wallet);
  const tx = await contractWithSigner.createDocument_test(byte32, {
    gasLimit: 1000000,
  });
  await tx.wait();

  console.log(">>>> Create document:", tx);
}

// createDoc()
//   .then(() => {
//     console.log(">>>> Done");
//   })
//   .catch((error) => {
//     console.log(">>>> Error", error);
//   });

// get data from transaction hash
async function getTxData() {
  try {
    const sha = sha256.getHash("test224");
    const byte32 = ethers.utils.hexZeroPad(sha, 32);
    const contractWithSigner = contract.connect(wallet);
    const tx = await contractWithSigner.createDocument_test(byte32, {
      gasLimit: 1000000,
    });
    const tx_ = await tx.wait();
    console.log('>>>> tx:', tx_)

    // const error = contract.interface.decodeError(tx_.data);
    // console.log(error.name); // DocumentFactory: Document already exists
    // console.log(error.args); // {}

  } catch (error) {
    // const receipt =  await provider.getTransaction(error.transactionHash);
    console.log(">>>> error:", error);
  }
}

getTxData();
