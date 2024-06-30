// server.js
import tls from 'tls';
import { generateSSL } from './ssl.js';

// certificados
const ssl = generateSSL('0.0.0.0');

const server = tls.createServer({
    key: ssl.private,
    cert: ssl.cert
}, (socket) => {
    console.log('Servidor: conexão estabelecida');
    socket.write('Olá, cliente!');
    socket.setEncoding('utf8');
    socket.pipe(socket);
});

server.listen(8000, () => {
    console.log('Servidor TLS ouvindo na porta 8000');
});
