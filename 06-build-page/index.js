const { getAllFiles, getSpecificFiles, readFileThenReturnIt, desinfectFolder } = require('../00-helper');
const reusableCopyDir = require('../04-copy-directory');
const { resolve, join, basename } = require('path');
const { mkdir, writeFile } = require('fs/promises');
const bundleStyles = require('../05-merge-styles');

async function bundler() {
    const path = resolve(__dirname);

    await desinfectFolder(join(path, 'project-dist'));
    await mkdir(join(path, 'project-dist'), { recursive: true });
    await bundleStyles(join(path), join(path, 'project-dist'), 'style.css');
    await reusableCopyDir(join(path, 'assets'), path + '/project-dist/assets/');

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
