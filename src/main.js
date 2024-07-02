// doc https://nodejs.org/api/worker_threads.html
import {
  Worker,
  isMainThread,
} from "node:worker_threads";

if (isMainThread) {
  console.log("spawning");
  let leader = 2;
  let count = 50;
  let netType = "quic";
  let workers = new Array();
  for (let id = 1; id <= count; id++) {
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
  const warnId = 3;
  workers[leader - 1].terminate();
  // workers[warnId + 2].postMessage("leaderDied");
  // await new Promise((r) => setTimeout(r, 500));
  workers[warnId - 1].postMessage("leaderDied");
}
