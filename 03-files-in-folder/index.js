const { stat } = require('fs');
const { readdir } = require('fs/promises');
const { resolve, extname } = require('path');

async function getFolderFiles(folder = resolve(__dirname, 'secret-folder')) {
    const folderName = folder;
    const dirFiles = await readdir(folderName, { withFileTypes: true });
    
    dirFiles.forEach(file => {
        if (file.isDirectory()) {
            return
        } else {
            const pathName = resolve(folderName + '/', file.name);
            
            stat(pathName, (err, stats) => {
                const fileInfo = file.name.split('.');
                console.log(`${fileInfo[0]} - ${fileInfo[1]} - ${(stats.size / 1024).toFixed(1)} kb`);

            })
        }
    })
}

getFolderFiles();
