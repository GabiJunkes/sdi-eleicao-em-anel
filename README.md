# sdi-eleicao-em-anel
Trabalho de sistemas distribuidos sobre eleição em anel, comparando TCP e QUIC

## Como rodar
`nvm use` ou estão se certifique que está usando NodeJS 22.3.0

Dentro de `src/main.js` poderá configurar quantos nós criar, quem começará como lider, quem avisar que o lider morreu e o protocolo QUIC ou TCP.

Então execute `npm start` e os logs apareceram no console podendo ver quem mandou mensagem para quem, assim sabendo quando a eleição começou e terminou

## Exemplo de log

Eleição em 7 nós, onde o lider era o 2, e o nó 3 iniciou a eleição

```
2024-07-02 00:06:29 3: envia Election para 4
2024-07-02 00:06:29 4: envia Election para 5
2024-07-02 00:06:30 5: envia Election para 6
2024-07-02 00:06:30 6: envia Election para 7
2024-07-02 00:06:30 7: envia Election para 1
2024-07-02 00:06:31 1: envia Election para 2
2024-07-02 00:06:31 1: envia Election para 3
2024-07-02 00:06:32 3: envia Elected para 4
2024-07-02 00:06:32 4: envia Elected para 5
2024-07-02 00:06:33 5: envia Elected para 6
2024-07-02 00:06:33 6: envia Elected para 7
2024-07-02 00:06:33 7: envia Elected para 1
2024-07-02 00:06:34 1: envia Elected para 2
2024-07-02 00:06:34 1: envia Elected para 3
```
