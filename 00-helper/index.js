const { readdir, rm, stat } = require('fs/promises');
const { createReadStream } = require('fs');
const { extname, join } = require('path');

async function getAllFiles(folder) {
    const dirFiles = await readdir(folder, { withFileTypes: true });
    const files = [];

    for (let file of dirFiles) {
        if (file.isDirectory()) {
            const data = await getAllFiles(join(folder, file.name));
            files.push(...data)
        } else {
            files.push(join(folder, file.name))
        }
    }

    return files;
}

function getSpecificFiles(arr, type) {
    const files = arr.filter((file) => {
        const splitThem = file.split('/');

        return extname(splitThem[splitThem.length - 1]) === type;
    });
    
    return files;
}

async function desinfectFolder(path) {
    try {
        await rm(path, { recursive: true })
    } catch {
        console.log('Nothing to remove')
    }
}

async function readFileThenReturnIt(file) {
    const { size } = stat(file);
    const stream = createReadStream(file, { highWaterMark: size, encoding: 'utf8' });
    let tempFile = '';

    for await (let text of stream) {    
        tempFile += text
    }

    return tempFile
}

exports.getAllFiles = getAllFiles;
exports.desinfectFolder = desinfectFolder;
exports.getSpecificFiles = getSpecificFiles;
exports.readFileThenReturnIt = readFileThenReturnIt;
