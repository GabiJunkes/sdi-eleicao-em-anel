import { Quic } from "../network/quic/main.js";
import { TCP } from "../network/tcp/main.js";
import * as classes from "../network/classes.js";
import { isMainThread, workerData, parentPort } from "node:worker_threads";

function calcNext(myId, count, max,) {
  let value = (myId + count + max) % max;
  if (value == 0) value = max;
  return value;
}

async function sendMessageUntilSucceed(network, id, max, message) {
  let count = 0;
  while (true) {
    count++;
    const nextId = calcNext(id, count, max);
    try {
      console.log(id, "sent", nextId, "", message);
      if (nextId != id) {
        await network.send(nextId, message);
        break
      }
    } catch (e) {
      console.log('falha ao mandar para ', nextId);
    }
  }
}

async function run(id, networkType, leaderId, maxId) {
  let max = maxId;
  let isLeaderDead = false;
  let leader = leaderId;
  let network = null;

  if (networkType == "quic") {
    network = await Quic.createQuicInstance(id);
  } else {
    network = new TCP(id);
  }

  parentPort.on("message", (msgName) => {
    if (msgName == "leaderDied") {
      isLeaderDead = true;
    } else {
      max = msgName;
    }
  });

  setInterval(async () => {
    const message = network.getMessage();
    if (!!message) {
      switch (message.type) {
        case "Election": {
          if (message.ownerId == id) {
            // election ended
            const responseMessage = new classes.Elected(id, message.maxId);
            await sendMessageUntilSucceed(network, id, max, responseMessage);
          } else if (id > message.maxId) {
            const responseMessage = new classes.Election(message.ownerId, id);
            await sendMessageUntilSucceed(network, id, max, responseMessage);
          } else {
            const responseMessage = new classes.Election(
              message.ownerId,
              message.maxId
            );
            await sendMessageUntilSucceed(network, id, max, responseMessage);
          }
          break
        }
        case "Elected": {
          leader = message.nodeId;
          if (message.ownerId != id) {
            const responseMessage = new classes.Elected(
              message.ownerId,
              message.nodeId
            );
            await sendMessageUntilSucceed(network, id, max, responseMessage);
          }
          break
        }
        default: {
          throw Error('DEU RUIM')
        }
      }
    } else {
      if (isLeaderDead) {
        const newElection = new classes.Election(id, id)
        await sendMessageUntilSucceed(network, id, max, newElection);
        isLeaderDead = false;
      }
    }
  }, 600);
}

if (!isMainThread) {
  await run(workerData.id, workerData.netType, workerData.leader, workerData.max);
}
