const { copyDir } = require('../04-copy-directory');
const { resolve, join, basename, extname } = require('path');
const { mkdir, writeFile, readdir, stat } = require('fs/promises');
const bundleStyles = require('../05-merge-styles');
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
