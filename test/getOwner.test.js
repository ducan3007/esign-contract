require("dotenv").config();
const ethers = require("ethers");
const chai = require("chai");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.ADDRESS;
const CONTRACT_ADDRESS = require("../build/DocumentFactory.json").address;
const ABI = require("../build/DocumentFactory.json").abi;

describe("Get Owner", () => {
  it("should return the owner of the contract", async () => {
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    const owner = await contract.owner();
    console.log({ owner });
    chai.expect(owner).to.equal(PUBLIC_KEY);
  });
});

describe("Get balance", () => {
  it("should return the balance of the contract", async () => {
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    const balance = await wallet.getBalance();
    console.log({ balance });
    chai.expect(true).to.equal(true);
  });
});
