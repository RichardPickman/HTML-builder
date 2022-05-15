const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname + '/text.txt'), 'utf8', (err, data) => {
    if (err) {
        console.log(err)
        return;
    }
    
    process.stdout.write(data)
})
