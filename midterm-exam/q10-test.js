'use strict';

if (process.argv.length < 3){
    console.log('Provide test argument');
    process.exit();
}

const fs = require('fs');
const inputFile = process.argv[2];

const stream = fs.createReadStream(inputFile, { encoding: 'utf8' });

function countStarWords(inputStream, outputStream, done){
    var numStarWords = 0;
    var state = ' ';
    var beginStarWord = false;

    function handleInputStream(blob) {
        for (var i = 0; i < blob.length; i ++){
            if (state == ' *') {
                if (blob[i] == '*') {
                    state += '*';
                } else {
                    state = '';
                }
            }
            else if (state == ' **') {
                if (blob[i] == ' ') {
                    if (beginStarWord) {
                        numStarWords++;
                        state = ' ';
                        beginStarWord = false;
                    }
                } else {
                    beginStarWord = true;
                }
            } else if (state == ' ') {
                if (blob[i] == '*') {
                    state += '*';
                } else if (blob[i] != ' '){
                    state = '';
                }
            } else {
                if (blob[i] == ' ') {
                    state += ' ';
                } else {
                    state = '';
                }
            }
        }
    }

    function handleOutputStream() {
        if (numStarWords > 10) {
            outputStream.write('-1');
        } else {
            outputStream.write(numStarWords.toString());
        }
        done();
    }

    inputStream.on('data', handleInputStream);
    inputStream.on('end', handleOutputStream);
}

countStarWords(stream, process.stdout, function(){
    process.exit();
});