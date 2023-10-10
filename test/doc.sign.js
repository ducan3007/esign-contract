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
const file = "123415718910";
let hash = null;

describe("Create document", () => {
  it("It should create a document", async () => {
    try {
      let sha = sha256.getHash(file);

      console.log(">>>> sha string :", sha.toString("hex"));

      let _sha = Buffer.from("639412791161c84c17dfd382338f3080b4c67f860e0db0b1d846723e5fc0fa39", "hex");


      const _signers = [
        {
          signed_at: 0,
          email: "lordmasterking001@gmail.com",
          signing_address: "0x0000000000000000000000000000000000000000",
        },
        {
          signed_at: 0,
          email: "anducnguyen3007@gmail.com",
          signing_address: "0x0000000000000000000000000000000000000000",
        },
      ];
      const contractWithSigner = _contract.connect(_wallet);

      let zeroPad = ethers.utils.hexZeroPad(sha, 32);
      
      const tx = await contractWithSigner.createDocument(zeroPad, _signers, {
        gasLimit: 10000000,
      });

      console.log(">>> raw tx", tx);
      
      await tx.wait().then((receipt) => {
        console.log(">>>> receipt:", receipt);
      });

      console.log(">>>> Create document:", tx);
      
      chai.expect(true).to.equal(true);
    } catch (error) {
      console.error("Create document error:", JSON.stringify(error, null, 1));
      chai.expect(error?.error?.data?.reason).to.equal("D403");
      console.error("Document already exits Error:", error?.error?.data?.reason);
    }
  });
});

describe("Add signer email", () => {
  it("It should add signerkafkaProducerService email", async () => {
    try {
      const address = ["0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9", "0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E"];
      const email = "anducnguyen3007@gmail.com";

      let private_key = process.env.PRIVATE_KEY;
      let wallet = new ethers.Wallet(private_key, provider);
      let contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

      const contractWithSigner = contract.connect(wallet);

      const tx = await contractWithSigner.updateSignerAddresses(email, address, {
        gasLimit: 1000000,
      });
      await tx.wait().then((receipt) => {});
      const signer_address = await contract.getSignerAddresses(email);
      console.log(">>>> signer_address:", signer_address);
    } catch (error) {
      console.error("Add signer error:", JSON.stringify(error, null, 1));
    }
  });
});

describe("Sign document", () => {
  it("It should sign a document", async () => {
    try {
      const email = "anducnguyen3007@gmail.com";

      let _sha = Buffer.from("639412791161c84c17dfd382338f3080b4c67f860e0db0b1d846723e5fc0fa39", "hex");

      let private_key = "0x829e924fdf021ba3dbbc4225edfece9aca04b929d6e75613329ca6f1d31c0bb4";

      let wallet = new ethers.Wallet(private_key, provider);

      console.log(">>>> wallet:", wallet.address);

      let contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
      let contractWithSigner = contract.connect(wallet);

      const tx = await contractWithSigner.signDocument(_sha, email, {
        gasLimit: 10000000,
      });

      await tx.wait().then((receipt) => {
        console.log(">>>> receipt:", receipt);
      });

      console.log(">>>> Sign document:", tx);
      chai.expect(true).to.equal(true);
    } catch (error) {
      console.error("Document Not Found Error:", JSON.stringify(error, null, 1));

      console.error(">>>> ERROR CODE: ", error?.code);

      const expectedCode = error.error.data.reason;

      console.log(">>>> expectedCode:", expectedCode);
      chai.expect(expectedCode.toString()).to.equal("D404");
      chai.expect(expectedCode.toString()).to.equal("D409");
      chai.expect(expectedCode.toString()).to.equal("D406");
      chai.expect(expectedCode.toString()).to.equal("D407");
      // throw error;
    }
  });
});

// describe("Get document", () => {
//   it("It should get a document", async () => {
//     try {
//       let sha = sha256.getHash(file);
//       let _sha = Buffer.from("639412791161c84c17dfd382338f3080b4c67f860e0db0b1d846723e5fc0fa39", "hex");

//       const document = await contract.getDocument(_sha);
//       // get JSON format

//       for (let i = 0; i < document.length; i++) {
//         let item = document[i];
//         console.log(">>>> item:", i, item);
//       }
//       console.log(">>>> item 0", document[0].toString());
//       console.log(">>>> item 1", document[1].toString());
//       console.log(">>>> item 2", document[2].toString());
//       console.log(">>>> item 3", document[3].toString());
//       console.log(">>>> item 4", document[4].toString());
//       console.log(">>>> item 5", document[5].toString());

//       chai.expect(true).to.equal(true);
//     } catch (error) {
//       throw error;
//     }
//   });
// });
