const { getAllFiles, getSpecificFiles } = require('../00-helper');
const { mkdir, writeFile, stat } = require('fs/promises');
const { createReadStream } = require('fs');
const { resolve, join } = require('path');


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
