const { createReadStream } = require('fs');
const { stat } = require('fs/promises');
const { resolve } = require('path');

async function readFileThenReturnIt(file = resolve(__dirname, 'text.txt')) {
    const { size } = stat(file);
    const stream = createReadStream(file, { highWaterMark: size, encoding: 'utf8' });
    let tempFile = '';

    for await (let text of stream) {    
        tempFile += text
    }

    process.stdout.write(tempFile)
}

readFileThenReturnIt()
