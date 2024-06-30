// Toda a logica de um no (definido em TDB.txt) e abstraido um objeto de quic ou tcp

import { Quic } from "../network/quic/main.js";
import { TCP } from "../network/tcp/main.js";
import * as classes from "../network/classes.js";

function calcNext(myId, count, max) {
    return (myId + count) % max
}

function sendMessageUntilSucceed(network, id, max, message) {
    let sended;
    let count = 0;
    while (sended) {
      count++;
      try {
        network.send(calcNext(id, count, max), message);
      } catch (_) {}
    }
}

function run(id, networkType) {
    const max = id;
    let leader = 0
    let network = null;
    if (networkType == "quic") {
        network = Quic.createQuicInstance(id);
    } else {
        network = new TCP(id);
    }
    while (true) {
        // pinga lider
        const message = network.getMessage();
        if (!!message) {
        switch (classes.getMessageType(message)) {
            case "Election": {
                // election ended
                if (message.ownerId == id) {
                    const responseMessage = classes.Elected(message.maxId);
                    sendMessageUntilSucceed(network, id, max, responseMessage)
                } else if (id > message.maxId) {
                    const responseMessage = classes.Election(message.ownerId, id, message.minId);
                    sendMessageUntilSucceed(network, id, max, responseMessage);
                } else {
                    const responseMessage = classes.Election(
                      message.ownerId,
                      message.maxId,
                      (message.minId > id) ? id : message.minId // get min id
                    );
                    sendMessageUntilSucceed(network, id, max, responseMessage);
                }
            }
            case "Elected": {
                leader = message.nodeId
            }
        }
    }
  }
}
