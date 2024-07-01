// Toda a logica de um no (definido em TDB.txt) e abstraido um objeto de quic ou tcp

import { Quic } from "../network/quic/main.js";
import { TCP } from "../network/tcp/main.js";
import * as classes from "../network/classes.js";
import { isMainThread, workerData, parentPort } from "node:worker_threads";

function calcNext(myId, count, max) {
  let value = (myId + max) % max;
  if (value == myId) value = (myId + max) % max;
  if (value == 0) value = max;
  return value;
}

async function sendMessageUntilSucceed(network, id, max, message) {
  let sended = false;
  let count = 0;
  while (!sended) {
    count++;
    try {
      await network.send(calcNext(id, count, max), message);
      sended = true;
    } catch (e) {
      console.log(e);
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
      switch (classes.getMessageType(message)) {
        case "Election": {
          // election ended
          console.log(id, message)
          if (message.ownerId == id) {
            const responseMessage = new classes.Elected(message.maxId);
            await sendMessageUntilSucceed(network, id, max, responseMessage);
          } else if (id > message.maxId) {
            const responseMessage = new classes.Election(
              message.ownerId,
              id,
              message.minId
            );
            await sendMessageUntilSucceed(network, id, max, responseMessage);
          } else {
            const responseMessage = new classes.Election(
              message.ownerId,
              message.maxId,
              message.minId > id ? id : message.minId // get min id
            );
            await sendMessageUntilSucceed(network, id, max, responseMessage);
          }
        }
        case "Elected": {
          leader = message.nodeId;
          if (message.ownerId != id) {
            await sendMessageUntilSucceed(network, id, max, message);
          }
        }
      }
    } else {
      if (isLeaderDead) {
        const newElection = new classes.Election(id,id,id)
        await sendMessageUntilSucceed(network, id, max, newElection);
        isLeaderDead = false;
      }
    }
  }, 600);
}

if (!isMainThread) {
  await run(workerData.id, workerData.netType, workerData.leader, workerData.max);
}
