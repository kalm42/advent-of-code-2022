const fs = require('fs');

function main() {
    const start = Date.now();
    const data = fs.readFileSync('input.txt', 'utf8');

    let startingPoint = 14;

    data.split(/\r?\n/).forEach((line) => {
        const _line = line.split('');
        // 4 character buffer until we find a 4 character sequence with all unique characters
        let buffer = _line.slice(0, 14);

        for (let index = 14; index < _line.length; index += 1) {
            if(areAllUnique(buffer)) {
                console.log('Found a match at index', startingPoint);
                break;
            }
            // remove the first character from the buffer
            buffer.shift();
            // add the next character to the buffer
            buffer.push(_line[index]);
            startingPoint += 1;
        }
        startingPoint = 4;
    })



    const end = Date.now();
    console.log({time: end - start});
}

main();

function areAllUnique(data) {
    const set = new Set(data);
    return set.size === data.length;
}

