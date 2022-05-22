const { mkdir, copyFile } = require('fs/promises');
const { getAllFiles, getFolders } = require('../00-helpers');
const { join, resolve } = require('path');

async function copyDir(initialFolder, outputFolder, buildFolders) {
    const fileArr = await getAllFiles(initialFolder);
    const folders = getFolders(fileArr, buildFolders);

    fileArr.forEach(async (file, index) => {
        const separateFile = file.split('/').slice(7);
        await mkdir(folders[index], { recursive: true });

        copyFile(file, join(outputFolder, ...separateFile));
    })
}

copyDir(join(resolve(__dirname), 'files'), join(resolve(__dirname), 'files-copy'), ['files', 'files-copy']);

exports.copyDir = copyDir;
