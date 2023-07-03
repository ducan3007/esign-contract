// require("dotenv").config();
// const fs = require("fs");
// const solc = require("solc");
// const ethers = require("ethers");
// const path = require("path");

// const ADDRESS = process.env.ADDRESS || "";
// const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
// const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

// console.log({
//   ADDRESS,
//   PRIVATE_KEY,
// });

// async function deployDocumentContract() {
//   const output = JSON.parse(
//     solc.compile(
//       JSON.stringify({
//         language: "Solidity",
//         sources: {
//           "DocumentFactory.sol": {
//             content: fs.readFileSync(
//               path.join(__dirname, "DocumentFactory.sol"),
//               "utf8"
//             ),
//           },
//           "Ownable.sol": {
//             content: fs.readFileSync(
//               path.join(__dirname, "Ownable.sol"),
//               "utf8"
//             ),
//           },
//           "Context.sol": {
//             content: fs.readFileSync(
//               path.join(__dirname, "Context.sol"),
//               "utf8"
//             ),
//           },
//         },
//         settings: {
//           outputSelection: {
//             "*": {
//               "*": ["*"],
//             },
//           },
//         },
//       })
//     )
//   );

//   const contract = {
//     abi: output.contracts["DocumentFactory.sol"]["DocumentFactory"].abi,
//     bytecode:
//       output.contracts["DocumentFactory.sol"]["DocumentFactory"].evm.bytecode
//         .object,
//     address: "",
//   };

//   const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
//   const factory = new ethers.ContractFactory(
//     contract.abi,
//     contract.bytecode,
//     wallet
//   );
//   const { address } = await factory.deploy();
//   contract.address = address;

//   fs.writeFileSync(
//     __dirname + "/build/" + "DocumentFactory.json",
//     JSON.stringify(contract)
//   );
//   console.log("Contract DocumentFactory deployed to: ", address);
// }

// deployDocumentContract();
