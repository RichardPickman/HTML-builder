const { mkdir, copyFile, readdir } = require('fs/promises');
const { join, resolve } = require('path');

function getFolders(arr, outputFolder) {
    const [input, output] = outputFolder;
    const files = arr.map((file) => {
        const result = file.split('/');
        const indexOf = result.findIndex(item => item === input);
        result[indexOf] = output;
        
        result.pop();

        return result.join('/')
    })
    
    return files
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

async function copyDir(initialFolder, outputFolder, buildFolders) {
    const fileArr = await getAllFiles(initialFolder);
    const folders = getFolders(fileArr, buildFolders);
    
    fileArr.forEach(async (file, index) => {
      const filePath = file.replace(initialFolder, '')
      await mkdir(folders[index], { recursive: true });
      
      copyFile(file, join(outputFolder, filePath));
    })
}

copyDir(join(resolve(__dirname), 'files'), join(resolve(__dirname), 'files-copy'), ['files', 'files-copy']);

exports.copyDir = copyDir;
