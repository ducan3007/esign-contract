require("dotenv").config();
const fs = require("fs");
const solc = require("solc");
const {ethers} = require("ethers");
const path = require("path");

const cwd = process.cwd();
const ADDRESS = process.env.ADDRESS || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

console.log({
  ADDRESS,
  PRIVATE_KEY,
});

async function deployDocumentContract() {
  try {
    const output = JSON.parse(
      solc.compile(
        JSON.stringify({
          language: "Solidity",
          sources: {
            "DocumentFactory.sol": {
              content: fs.readFileSync(path.join(cwd, "contracts", "DocumentFactory.sol"), "utf8"),
            },
            "Ownable.sol": {
              content: fs.readFileSync(path.join(cwd, "contracts", "Ownable.sol"), "utf8"),
            },
            "Context.sol": {
              content: fs.readFileSync(path.join(cwd, "contracts", "Context.sol"), "utf8"),
            },
          },
          settings: {
            outputSelection: {
              "*": {
                "*": ["*"],
              },
            },
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
        })
      )
    );

    if (output.errors) {
      throw output.errors;
    }

    const contract = {
      abi: output.contracts["DocumentFactory.sol"]["DocumentFactory"].abi,
      bytecode: output.contracts["DocumentFactory.sol"]["DocumentFactory"].evm.bytecode.object,
      address: "",
    };

    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const factory = new ethers.ContractFactory(contract.abi, contract.bytecode, wallet);
    const { address } = await factory.deploy({
      gasLimit: 1000000,
    });
    contract.address = address;

    fs.writeFileSync(cwd + "/build/" + "DocumentFactory.json", JSON.stringify(contract));
    console.log("Contract DocumentFactory deployed to: ", address);
  } catch (error) {
    throw error;
  }
}

deployDocumentContract();
