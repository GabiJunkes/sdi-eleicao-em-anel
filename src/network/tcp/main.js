//implementar o handshake do tls para o tcp
import tls from "tls";
import { generateSSL } from "../../crypto/ssl.js"; //ajustar o caminho

export class TCP {
  constructor(id) {
    this.id = id;
    this.ssl = generateSSL(this.id);
    this.received = new Array();

    this.server = tls.createServer({
      key: this.ssl.private,
      cert: this.ssl.cert,
      host: "127.0.0.1",
      port: 5000 + this.id,
    });

    this.server.addListener("secureConnection", (socket) => {
      socket.on("data", (elem) => {
        const data = JSON.parse(elem);
        console.log(data);
        this.received.push(data);
      });
    });

    this.server.listen(5000 + this.id);
  }

  getMessage() {
    return this.received.shift();
  }

  send(id, msg) {
    this.options = {
      host: "127.0.0.1",
      port: 5000 + id,
      rejectUnauthorized: false, //usado para evitar que rejeite a conexao caso o certificado não seja autorizado
      ca: [this.ssl.cert], // Certificado do servidor
    };
    const client = tls.connect(this.options, () => {
      client.write(Buffer.from(JSON.stringify(msg)));
    });
  }
}
