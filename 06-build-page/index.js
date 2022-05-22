const { getSpecificFiles, bundleStyles } = require('../05-merge-styles');
const { getAllFiles, copyDir } = require('../04-copy-directory');
const { mkdir, writeFile, stat, rm } = require('fs/promises');
const { resolve, join, basename, extname } = require('path');
const { createReadStream } = require('fs');

async function readFileThenReturnIt(file) {
    const { size } = stat(file);
    const stream = createReadStream(file, { highWaterMark: size, encoding: 'utf8' });
    let tempFile = '';

    for await (let text of stream) {    
        tempFile += text
    }

    return tempFile
}

async function desinfectFolder(path) {
    try {
        await rm(path, { recursive: true })
    } catch {
        console.log('Nothing to remove')
    }
}

async function bundler() {
    const path = resolve(__dirname);

    await desinfectFolder(join(path, 'project-dist'));

    await mkdir(join(path, 'project-dist'), { recursive: true });
    await bundleStyles(join(path), join(path, 'project-dist'), 'style.css');
    await copyDir(join(path, 'assets'), path + '/project-dist/assets', ['assets', 'project-dist/assets']);

    const allDirFiles = await getAllFiles(join(path));
    const htmlPaths = await getSpecificFiles(allDirFiles, '.html');
    const templates = [...htmlPaths];

    for (let i = 0; i < templates.length; i++) {
        templates[i] = basename(templates[i], '.html');
    }

    let indexFile = await readFileThenReturnIt(path + '/template.html');

    templates.forEach(async (temp, index) => {
        let tempFile = await readFileThenReturnIt(htmlPaths[index]);

        indexFile = indexFile.replace(`{{${temp}}}`, tempFile);

        writeFile(join(path, 'project-dist', 'index.html'), indexFile);
    })
}

bundler();
