// instancia nós
// doc https://nodejs.org/api/worker_threads.html
// interface pra matar nos, finalizar execucao (close em todas as threads), parse de logs e printar logs
// parse de logs = tempo de eleicao


import { Quic } from "./network/quic/main.js";
import { TCP } from "./network/tcp/main.js";
import { Election } from "./network/classes.js";


const quic1 = new TCP(1);
const quic2 = new TCP(2);

const election2 = new Election(2, 2, 2)
const election1 = new Election(1, 1, 1);
quic2.send(1, election2);

quic1.getMessage()