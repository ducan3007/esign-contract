require("dotenv").config();
const ethers = require("ethers");
const { Kafka } = require("kafkajs");

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const kafkaClient = new Kafka({
  clientId: "my-app12",
  brokers: ["localhost:9093", "localhost:9094", "localhost:9095"],
});

async function consumMessage(topic, groupId) {
  const consumer = kafkaClient.consumer({ groupId: groupId });
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await new Promise((resolve) => setTimeout(resolve, 120));
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
    autoCommit: false,
  });
}

// consumMessage("document.v1.status.sign", "document.v1.status.sign");
consumMessage("document.v2.status.create", "document.v2.status.create-1");
