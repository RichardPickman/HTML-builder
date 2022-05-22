const { stat } = require('fs');
const { readdir } = require('fs/promises');
const { resolve, extname } = require('path');

const currentPath = resolve(__dirname + '/', 'secret-folder')

async function getFolderFiles(folder = currentPath) {
    const folderName = folder;
    const dirFiles = await readdir(folderName, { withFileTypes: true });
    
    dirFiles.forEach(file => {
        if (file.isDirectory()) {
            getFolderFiles(currentPath + '/' + file.name);
        } else {
            const pathName = resolve(folderName + '/', file.name);
            
            stat(pathName, (err, stats) => {
                const fileInfo = file.name.split('.');
                console.log(`${fileInfo[0] || 'Doesn\'t have name'} - ${fileInfo[1]} - ${stats.size}`);

            })
        }
    })
}

getFolderFiles();
