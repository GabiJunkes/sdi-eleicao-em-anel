// Gab
// DOC: https://github.com/nodejs/quic/blob/master/doc/api/quic.md

import quic from "@matrixai/quic";
import * as utils from "../../crypto/utils.js";

export class Quic {
  constructor(id, key, keyPairRSAPEM, certRSAPEM) {
    this.id = id;
    this.key = key;
    this.keyPairRSAPEM = keyPairRSAPEM;
    this.certRSAPEM = certRSAPEM;
    this.quickServer = null;
    this.received = new Array();
  }

  getMessage() {
    return this.received.shift();
  }

  static async createQuicInstance(id) {
    const key = await utils.generateKeyHMAC();
    const keyPairRSA = await utils.generateKeyPairRSA();
    const certRSA = await utils.generateCertificate({
      certId: "0",
      subjectKeyPair: keyPairRSA,
      issuerPrivateKey: keyPairRSA.privateKey,
      duration: 60 * 60 * 24 * 365 * 10,
    });
    const keyPairRSAPEM = await utils.keyPairRSAToPEM(keyPairRSA);
    const certRSAPEM = utils.certToPEM(certRSA);
    const serverCryptoOps = {
      sign: utils.signHMAC,
      verify: utils.verifyHMAC,
    };

    const quicInstance = new Quic(id, key, keyPairRSAPEM, certRSAPEM);

    // create quic server
    quicInstance.quicServer = new quic.QUICServer({
      crypto: {
        key: quicInstance.key,
        ops: serverCryptoOps,
      },
      config: {
        key: quicInstance.keyPairRSAPEM.privateKey,
        cert: quicInstance.certRSAPEM,
      },
    });

    // add listener when server receives data
    quicInstance.quicServer.addEventListener(
      quic.events.EventQUICConnectionStream.name,
      async (streamEvent) => {
        const detail = streamEvent.detail;
        const reader = detail.readable.getReader();
        await reader.read().then(({ done, value }) => {
          const data = JSON.parse(value);
          quicInstance.received.push(data);
          if (done) {
            reader.releaseLock();
          }
        });
      }
    );

    // start listening
    await quicInstance.quicServer.start({
      host: "::ffff:127.0.0.1",
      port: 5000 + quicInstance.id,
      ipv6Only: false,
    });

    return quicInstance;
  }

  async send(id, msg) {
    const client = await quic.QUICClient.createQUICClient({
      host: "::ffff:127.0.0.1",
      port: 5000 + id,
      localHost: "::",
      crypto: {
        ops: { randomBytes: utils.randomBytes },
      },
      config: {
        verifyPeer: false,
        maxIdleTimeout: 400,
      },
    });

    const stream = client.connection.newStream("uni");
    const writer = stream.writable.getWriter();
    await writer.write(Buffer.from(JSON.stringify(msg)));
    await writer.close();
    
  }
}
