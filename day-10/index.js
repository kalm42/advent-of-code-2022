const fs = require('fs');

function main() {
    const start = Date.now();

    const file = fs.readFileSync('./input.txt', 'utf8');
    
    let cycles = 0;
    let register = 1;
    const interestingSignal = [];
    let sum = 0;
    let screen = '';

    const isItInteresting = () => {
        let screenPosition = (cycles - 1) % 40;

        // Reset for next line
        if (screenPosition === 0 && screen.length > 1) {
            interestingSignal.push(screen);
            screen = '';
        }

        // Is the sprite 1px from the current screen position?
        const diff = Math.abs(screenPosition - (register % 40));
        screen += diff < 2 ? '#' : '.';

        // If next line of the CRT is ready to be drawn
        if ((cycles - 20) % 40 === 0) {
            sum += cycles * register;
        }
    };

    file.split(/\r?\n/).forEach((line) => {
        // start cycle
        cycles += 1;
        // check if we should do something
        isItInteresting();

        // parse command
        const [command, value] = line.split(' ').map((value) => value.trim());
        if (command === 'addx') {
            // addx takes one extra cycle
            cycles += 1;
            // It's a new cycle so we should check if we should do something
            isItInteresting();
            // cycle is over, mutate register
            register += Number(value);
        }
    })

    // Don't forget the last line
    interestingSignal.push(screen);

    const end = Date.now();
    console.log({sum, time: end - start})
    console.log(interestingSignal.join('\n'));
}
main();

// Part 1 = 12640
// part 2 = EHBZLRJR