const { readdir, mkdir, copyFile } = require('fs/promises');
const { getAllFiles } = require('../00-helper');
const { join } = require('path');

async function reusableCopyDir(checkDir, dirName) {
    const filesArr = await readdir(checkDir, { withFileTypes: true });

    mkdir(dirName, { recursive: true });

    filesArr.forEach(file => {
        const initialFolder = join(checkDir, file.name);
        const outputFolder = join(dirName, file.name);
        
        if (file.isDirectory()) reusableCopyDir(initialFolder, outputFolder);
        else copyFile(initialFolder, outputFolder);
    })
}

module.exports = reusableCopyDir;
