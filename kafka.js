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
const topicsToCreate = ["document.v1.status.create", "document.v1.status.sign", "email.v1.notify", "email.v1.remind"];

async function createTopics() {
  const admin = kafkaClient.admin();
  await admin.connect();
  await admin.createTopics({
    topics: topicsToCreate.map((topic) => ({ topic: topic, numPartitions: 10, replicationFactor: 1 })),
  });
  await admin.create;
  await admin.disconnect();
}

function createRoundRobinPartitioner() {
  let counter = 0;
  return ({ topic, partitionMetadata }) => {
    counter++;
    if (counter >= partitionMetadata.length) {
      counter = 0;
    }
    return counter;
  };
}

async function produceMessage(topic, message) {
  const producer = kafkaClient.producer();
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: message }],
  });
}

async function main() {
  await createTopics();

  // Listen to contract events and produce messages to Kafka

  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const factory = new ethers.Contract(contract.address, contract.abi, wallet);

  factory.on("DocumentCreated", async (hash, creator) => {
    console.log("DocumentCreated ", { hash, creator,timestamp: Date.now() });
    await produceMessage("document.v1.status.create", JSON.stringify({ hash, creator, timestamp: Date.now() }));
  });
}

main();

// createTopics();

// setInterval(async () => {
//   console.log("Sending message to", "document.v1.status.create");
//   await produceMessage("document.v1.status.create", "Hello Kafka");
// }, 2000);

// // setInterval(async () => {
// //   console.log("Sending message to", "document.v1.status.sign");
// //   await produceMessage("document.v1.status.sign", "Hello Kafka");
// // }, 2000);
