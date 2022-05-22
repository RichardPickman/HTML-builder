const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname + '/text.txt'), 'utf8', (err, data) => {
    process.stdout.write(data)
})
