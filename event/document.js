require("dotenv").config();
const { ethers, provider } = require("ethers");
const { Kafka } = require("kafkajs");
const contract = require("../build/DocumentFactory.json");

// const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const documentFactory = new ethers.Contract(contract.address, contract.abi, wallet);

const kafkaClient = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9093"],
});
const topicsToCreate = ["contract.event.v1.DocumentCreated"];

async function createTopics() {
  const admin = kafkaClient.admin();
  await admin.connect();
  await admin.createTopics({
    topics: topicsToCreate.map((topic) => ({ topic: topic, numPartitions: 10, replicationFactor: 1 })),
  });
  await admin.create;
  await admin.disconnect();
}

async function produceMessage(topic, message) {
  const producer = kafkaClient.producer();
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: message }],
  });
}

createTopics();

// factoryFactory.on("DocumentCreated", async (documentId, owner, name, description, status, event) => {
//     console.log("DocumentCreated", documentId, owner, name, description, status);
//     }
// );
