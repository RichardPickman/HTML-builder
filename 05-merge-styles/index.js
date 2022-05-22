const { mkdir, writeFile, stat } = require('fs/promises');
const { getAllFiles } = require('../04-copy-directory');
const { resolve, join, extname } = require('path');
const { createReadStream } = require('fs');

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

exports.bundleStyles = bundleStyles;
exports.getSpecificFiles = getSpecificFiles;
