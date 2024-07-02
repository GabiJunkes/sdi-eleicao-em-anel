export default function logger(nodeId, msg) {
    const timestamp = new Date().toISOString().replace('T', ' ').replace(/\..*$/, '');
    const newLine = `${timestamp} ${nodeId}: ${msg}`;
    console.log(newLine);
}