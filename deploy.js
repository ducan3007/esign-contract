require("dotenv").config();
const ethers = require("ethers");
const solc = require("solc");
const fs = require("fs");

const ADDRESS = process.env.ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

console.log({
  ADDRESS,
  PRIVATE_KEY,
});

async function deployContract() {
  const output = JSON.parse(
    solc.compile(
      JSON.stringify({
        language: "Solidity",
        sources: {
          "DocumentFactory.sol": {
            content: fs.readFileSync(__dirname + "/contracts/" + "DocumentFactory.sol", "utf8"),
          },
          "Ownable.sol": {
            content: fs.readFileSync(__dirname + "/contracts/" + "Ownable.sol", "utf8"),
          },
          "Context.sol": {
            content: fs.readFileSync(__dirname + "/contracts/" + "Context.sol", "utf8"),
          },
        },
        settings: {
          outputSelection: {
            "*": {
              "*": ["*"],
            },
          },
        },
      })
    )
  );

  fs.writeFileSync(
    __dirname + "/" + "DocumentFactory.json",
    JSON.stringify(output.contracts["DocumentFactory.sol"]["DocumentFactory"])
  );

  const contract = {
    abi: output.contracts["DocumentFactory.sol"]["DocumentFactory"].abi,
    bytecode: output.contracts["DocumentFactory.sol"]["DocumentFactory"].evm.bytecode.object,
    address: "",
  };

  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const factory = new ethers.ContractFactory(contract.abi, contract.bytecode, wallet);
  const { address } = await factory.deploy();
  contract.address = address;

  fs.writeFileSync(__dirname + "/build/" + "DocumentFactory.json", JSON.stringify(contract));
}

deployContract();
