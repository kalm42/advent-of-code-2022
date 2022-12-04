const fs = require('fs');

function main() {
    const start = Date.now();
    let sections = fs.readFileSync('./beach-cleanup.txt', 'utf-8');

    // Each range has a min and max
    // if the min is greater or equal to another min, and the max is less than or equal to another max, then it is contained
    // if it is contained increment the count
    let count = 0;
    let count2 = 0;
    sections = sections.split(/[\r?\n,]+/);

    for (let i = 0; i < sections.length; i += 2) {
        const [firstMin, firstMax] = sections[i].split('-').map((a) => parseInt(a));
        const [secondMin, secondMax] = sections[i + 1].split('-').map((a) => parseInt(a));

        
        // if firstMin is greater than or equal to secondMin and firstMax is less than or equal to secondMax
        // then first is contained in second and we can increment the count
        if (firstMin >= secondMin && firstMax <= secondMax) {
            count += 1;
        } else if (secondMin >= firstMin && secondMax <= firstMax) {
            count += 1;
        }

        if((firstMax >= secondMin && firstMax <= secondMax) || (secondMin <= firstMax && firstMin <= secondMax)) {
            count2 += 1;
        }
    }

    const end = Date.now();
    console.log({count, count2, time: end - start});
}

main();

// 444
// 801
