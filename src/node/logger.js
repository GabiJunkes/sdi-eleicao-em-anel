export default function logger(nodeId, msg) {
    const timestamp = new Date().toISOString().replace('T', ' ').replace(/\..*$/, '');
    const newLine = `${timestamp} ${noId}: ${msg}`;
    console.log(newLine);
}