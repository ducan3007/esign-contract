require("dotenv").config();
const contract = require("../build/DocumentFactory.json");
const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const documentFactory = new ethers.Contract(contract.address, contract.abi, wallet);

documentFactory.on("DocumentCreated", async (hash, owner, name, description, status, event) => {
  console.log("\n DocumentCreated\n ", {
    hash,
    owner,
    name,
    description,
    status,
    event,
  });
});


documentFactory.on("DocumentSigned", async (hash, owner, email, tx, description, status, event) => {
  console.log("\n DocumentSigned\n ", {
    hash,
    owner,
    email,
    tx,
    description,
    status,
    event,
  });
});
