require("dotenv").config();
const ethers = require("ethers");
const { Kafka } = require("kafkajs");
const contract = require("./build/DocumentFactory.json");

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const kafkaClient = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9093"],
});
const topicsToCreate = ["document.v2.status.create", "document.v2.status.sign", "email.v2.notify", "email.v2.remind"];

async function createTopics() {
  const admin = kafkaClient.admin();
  await admin.connect();
  await admin.createTopics({
    topics: topicsToCreate.map((topic) => ({ topic: topic, numPartitions: 10, replicationFactor: 3 })),
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
  console.log("Sending message to", "document.v2.status.create");
}

async function main() {
  await createTopics();

  // Listen to contract events and produce messages to Kafka

  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const factory = new ethers.Contract(contract.address, contract.abi, wallet);

  factory.on("DocumentCreated", async (hash, creator) => {
    console.log("DocumentCreated ", { hash, creator, timestamp: Date.now() });
    await produceMessage("document.v1.status.create", JSON.stringify({ hash, creator, timestamp: Date.now() }));
  });
}

// main();

async function seed() {
  await createTopics();
  setInterval(async () => {
    await produceMessage("document.v2.status.create", "Hello Kafka");
  }, 50);
}

seed();
