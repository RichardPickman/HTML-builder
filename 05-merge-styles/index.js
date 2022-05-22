const { mkdir, writeFile, stat, readdir } = require('fs/promises');
const { createReadStream } = require('fs');
const { resolve, join, extname } = require('path');

async function desinfectFolder(path) {
    try {
        await rm(path, { recursive: true })
    } catch {
        console.log('Nothing to remove')
    }
}

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


async function bundleStyles(path, outputDir, outputFile) {
    const currentFiles = await getAllFiles(path);
    const styleFiles = getSpecificFiles(currentFiles, '.css');
    const filesContent = [];

    await mkdir(outputDir, { recursive: true });
    
    for (let file of styleFiles) {
        const { size } = stat(file);
        const readStream = createReadStream(file, { highWaterMark: size, encoding: 'utf8' });
    
        for await (const text of readStream) {
            filesContent.push(text);
        }
    }
    
    writeFile(join(outputDir, outputFile), filesContent.join('\n'));
}

const path = resolve(__dirname);

bundleStyles(
    path + '/',
    path + '/project-dist/',
    'bundle.css',
);

module.exports = bundleStyles;
