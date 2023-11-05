require("dotenv").config();
const fs = require("fs");
const solc = require("solc");
const { ethers } = require("ethers");
const ipfs = require("ipfs-http-client");
const path = require("path");
const redis = require("ioredis");

const cwd = process.cwd();
const ADDRESS = process.env.ADDRESS || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

console.log({
  ADDRESS,
  PRIVATE_KEY,
});

const ipfs_client = ipfs.create({
  host: "0.0.0.0",
  port: 5001,
  protocol: "http",
});

const redis_client = new redis({
  host: "redis-17563.c252.ap-southeast-1-1.ec2.cloud.redislabs.com",
  port: 17563,
  username: "default",
  password: "oTOCsQP06WgITsUWdpHd9pP93l4twYvX",
});

async function deployCertificateContract() {
  try {
    const output = JSON.parse(
      solc.compile(
        JSON.stringify({
          language: "Solidity",
          sources: {
            "CertificateFactory.sol": {
              content: fs.readFileSync(path.join(cwd, "contracts", "CertificateFactory.sol"), "utf8"),
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
      abi: output.contracts["CertificateFactory.sol"]["CertificateFactory"].abi,
      bytecode: output.contracts["CertificateFactory.sol"]["CertificateFactory"].evm.bytecode.object,
      address: "",
    };

    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const factory = new ethers.ContractFactory(contract.abi, contract.bytecode, wallet);
    const { address } = await factory.deploy({
      gasLimit: 10000000,
    });
    contract.address = address;
    

    fs.writeFileSync(cwd + "/build/" + "CertificateFactory.json", JSON.stringify(contract));
    console.log("Contract CertificateFactory deployed to: ", address);


    delete contract.bytecode;

    const fileHash = await ipfs_client.add(JSON.stringify(contract));
    await redis_client.set("esign:contract:CertificateFactory", fileHash.path);

  } catch (error) {
    throw error;
  }
}

deployCertificateContract();