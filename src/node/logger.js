import { writeFile } from 'fs';

export default function logger(noId, msg) {
    const timestamp = new Date().toISOString().replace('T', ' ').replace(/\..*$/, '');
    const newLine = `${timestamp} ${noId}: ${msg}\n`;

    try {
        writeFile('./logs.txt', newLine, { flag: 'a' });
    } catch (error) {
        console.error(`${error}`);
    }
}