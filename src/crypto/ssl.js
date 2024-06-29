import selfsigned from "selfsigned";

export function generateSSL(id) {
    var pems = selfsigned.generate(null, { id, days: 365 });
    return pems;
}


