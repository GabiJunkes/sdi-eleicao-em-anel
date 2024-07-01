// instancia nós
// doc https://nodejs.org/api/worker_threads.html
// interface pra matar nos, finalizar execucao (close em todas as threads), parse de logs e printar logs
// parse de logs = tempo de eleicao
import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from "node:worker_threads";
import * as node from "./node/main.js";

import readline from "node:readline";

if (isMainThread) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("spawning");
  let leader = 2;
  let count = 3;
  let netType = "quic";
  let workers = new Array();
  for (let id = 1; id <= count; id++) {
    console.log("spawning", id);
    const worker = new Worker("./src/node/main.js", {
      workerData: { id, netType, leader, max: count },
    });
    worker.on("newLeader", (leaderId) => {
      leader = leaderId;
    });
    worker.on("exit", () => {
      console.log("desligando");
    });
    workers.push(worker);
  }
  await new Promise((r) => setTimeout(r, 500));
  const warnId = 1;
  workers[leader - 1].terminate();
  workers[warnId - 1].postMessage("leaderDied");
  // rl.question(`Matar lider?`, (warnId) => {
  //     console.log("matar", warnId);
  //   workers[leader-1].terminate()
  //   workers[warnId - 1].postMessage("leaderDied");
  //   rl.close();
  // });
} else {
  console.log("else");
}
