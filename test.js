require("dotenv").config();
const ethers = require("ethers");
const { formatError } = require("ethers/lib/utils");
const chai = require("chai");
const ABI = require("./build/DocumentFactory.json").abi;
const CONTRACT_ADDRESS = require("./build/DocumentFactory.json").address;
const sha256 = require("./utils/sha256");
const web3 = require("web3");
const PRIVATE_KEY = "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1";
const PUBLIC_KEY = process.env.ADDRESS;

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

function decodeError() {
  const error =
    "0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000044434303400000000000000000000000000000000000000000000000000000000";
  const decodedError = web3.utils.hexToAscii(error);

  getErrorMessage("D404", decodedError);
}

function getErrorMessage(expectedCode, decodedError) {
  const expectedCodeSize = expectedCode.length;
  for (let i = 0; i < decodedError.length; i++) {
    const code = decodedError.substring(i, i + expectedCodeSize);
    if (code === expectedCode) {
      console.log(">>>> code:", code);
    }
  }
}
decodeError();

function poc(hex) {
  return web3.utils.hexToAscii(hex);
}

function extractStringFromHex(hex) {
  //   console.log("hex size", hex.length);
  //   console.log("error string fnc", hex.substring(2, 10));
  //   console.log("Offset of string return value", hex.substring(10, 10 + 64));
  //   console.log("Length of string return value", hex.substring(10 + 64, 10 + 128));
  //   console.log("String return value", poc("0x" + hex.substring(10 + 128, 10 + 128 + 64)).trim() + "" === "D404");
  //   console.log("D404" === "D404");

  return poc("0x" + hex.substring(10 + 128, 10 + 128 + 64)).trim() + "" === "D404";
}

// Test the function with an example hex string
const hex =
  "0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000044434303400000000000000000000000000000000000000000000000000000000";
extractStringFromHex(hex);
console.log("0x08c379a0".length);
console.log("0000000000000000000000000000000000000000000000000000000000000020".length);
// extractStringFromHex(hex);
// extractStringFromHex(hex);
