const fs = require('fs');
const path = require('path');
const readline = require('readline');

function createFile(){
    let stream = fs.createWriteStream(path.resolve(__dirname + '/data.txt'));
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.setPrompt('Salut! Please write your message. \n');
    rl.prompt();

    rl.on('line', (userInput) => {
        let arrayOfWords = userInput.trim().split(' ')

        if (arrayOfWords.includes('exit')) {
            const getMessage = arrayOfWords.filter(word => word !== 'exit').join(' ')
            
            stream.write(getMessage)

            rl.close()
        } else {
            stream.write(userInput.trim() + '\n')
        }

        return;
    });

    rl.on('SIGINT', () => {
        rl.close()
        return;
    })

    rl.on('close', () => {
        console.log('Goodbye! Come again! \n');
        return;
    })
}


createFile();

