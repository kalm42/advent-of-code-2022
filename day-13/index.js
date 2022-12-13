const fs = require('fs');

function main() {
    const start = Date.now();
    const file = fs.readFileSync('./input.txt', 'utf8');
    const part2Lines = parsePart2(file);
    const part2 = part2Lines.sort((a, b) => compare([a, b]));
    const decoderKeys = []
    for (let index = 1; index <= part2.length; index += 1) {
        const encodedMessage = JSON.stringify(part2[index - 1]);
        if (encodedMessage === "[[2]]" || encodedMessage === "[[6]]") {
            decoderKeys.push(index);
        }
        console.log(JSON.stringify(part2[index - 1]));
    }
    const part2Answer = decoderKeys[0] * decoderKeys[1];

    
    const lines = parse(file);
    let correctPairs = 0

    for (let index = 1; index <= lines.length; index += 1) {
        console.log(`== Pair ${index} ==\n`)
        console.log(`Compare ${JSON.stringify(lines[index - 1][0])} vs ${JSON.stringify(lines[index - 1][1])}.`)
        let consoleLog = ``;
        if (compare(lines[index - 1]) === -1) {
            consoleLog += `\nSum of indices is = ${correctPairs} + ${index}.`;
            correctPairs += index;
        }
        consoleLog += `\nUpdated sum of indices is ${correctPairs}\n\n`;
        console.log(consoleLog);
    }

    const end = Date.now();
    console.log({part1: correctPairs, part2: part2Answer, time: end - start});
}
main();

// returns 1 if correct, -1 if not correct, 0 if they are equal
function compare(line) {
    const [left, right] = line;
    let result = 0;

    for (let i = 0; i < left.length; i += 1) {
        const leftItem = left[i];
        const leftType = typeof leftItem;
        const rightItem = right[i];
        const rightType = typeof rightItem;
        
        if (rightType === 'undefined') {
            console.log(`The right side ran out of items, so the inputs are not in the right order.`);
            //  If the right list runs out of items first, the inputs are not in the right order.
            result = 1;
            break;
        }
        
        if (leftType === 'number' && rightType === 'number') {
            console.log(`Compare ${leftItem} vs ${rightItem}`);
            if (leftItem < rightItem) {
                console.log(`The left side is smaller, so the inputs are in the right order.`)
                result = -1;
                break;
            } else if (leftItem > rightItem) {
                console.log(`The right side is smaller, so the inputs are not in the right order.`)
                result = 1;
                break;
            } else {
                result = 0;
            }
        } else if (leftType === 'object' && rightType === 'object') {
            console.log(`Compare ${JSON.stringify(leftItem)} vs ${JSON.stringify(rightItem)}`);
            // They are both arrays, recurse
            const r = compare([leftItem, rightItem])
            if (r !== 0) {
                result = r;
                break;
            }
        } else {
            // They are mixed types, covert one to an array and recurse
            let _leftItem = Array.isArray(leftItem) ? leftItem : [leftItem];
            let _rightItem = Array.isArray(rightItem) ? rightItem : [rightItem];
            console.log(`Compare ${JSON.stringify(leftItem)} vs ${JSON.stringify(rightItem)}.`)
            console.log(`Mixed types; convert ${Array.isArray(leftItem) ? 'right' : 'left'} to [${Array.isArray(leftItem) ? rightItem : leftItem}] and retry comparison.`);
            const r = compare([_leftItem, _rightItem]);
            if (r !== 0) {
                result = r;
                break;
            }
        }
    }
    if (left.length < right.length && result === 0) {
        console.log(`Left side ran out of items, so the inputs are in the right order.`);
        result = -1;
    }
    return result;
}

function parse(file) {
    const _lines = file.split(/\r?\n/).filter((line) => line !== '').map((line) => eval(line));
    const lines = [];

    for (let i = 0; i < _lines.length; i += 2) {
        lines.push([_lines[i], _lines[i + 1]]);
    }
    return lines;
}

function parsePart2(file) {
    const lines = file.split(/\r?\n/)
        .filter((line) => line !== '')
        .map((line) => eval(line))
    lines.push([[2]]);
    lines.push([[6]]);
    return lines;
}

// 1_259 too low
// not 3_778
// 5_778 too high