const fs = require('fs');

function main() {
    const start = Date.now();
    const crates = [
        ['F', 'C', 'P', 'G', 'Q', 'R'], 
        ['W', 'T', 'C', 'P'], 
        ['B', 'H', 'P', 'M', 'C'], 
        ['L', 'T', 'Q', 'S', 'M', 'P', 'R'],
        ['P', 'H', 'J', 'Z', 'V', 'G', 'N'],
        ['D', 'P', 'J'],
        ['L', 'G', 'P', 'Z', 'F', 'J', 'T', 'R'],
        ['N', 'L', 'H', 'C', 'F', 'P', 'T', 'J'],
        ['G', 'V', 'Z', 'Q', 'H', 'T', 'C', 'W'],
    ]

    fs.readFileSync('instructions.txt', 'utf8').split(/\r?\n/).forEach((command) => {
        const [_, howMany, __, from, ___, to] = command.trim().split(' ');
        // crate mover 9000
        // for (let index = 0; index < howMany; index += 1) {
        //     const crate = crates[from - 1].pop();
        //     crates[to - 1].push(crate);
        // }

        // crate mover 9001
        const liftedCrates = crates[from - 1].splice(-howMany, howMany);
        crates[to - 1].push(...liftedCrates);
    })

    const finalAnswer = crates.reduce((answer, stack) => {
        return answer + stack[stack.length - 1];
    }, '')

    const end = Date.now();
    console.log({finalAnswer, time: end - start});
}

main();
