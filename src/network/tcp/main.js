//implementar o handshake do tls para o tcp
import tls from 'tls';
import { generateSSL } from './ssl.js';//ajustar o caminho

const ssl = generateSSL('0.0.0.0');

// Opções para o cliente TLS
const options = {
    host: 'localhost',
    port: 8000,
    rejectUnauthorized: false, //usado para evitar que rejeite a conexao caso o certificado não seja autorizado
    ca: [ssl.cert] // Certificado do servidor
};

const client = tls.connect(options, () => {
    console.log('conexao feita');
    client.write('ola do cliente');
});

client.on('data', (data) => {
    console.log('recebido:', data.toString());
    client.end();
});

client.on('end', () => {
    console.log('conexao encerrada');
});

client.on('error', (err) => {
  console.error('Erro do cliente:', err);
});