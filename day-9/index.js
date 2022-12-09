const fs = require('fs');

function main() {
    const start = Date.now();
    const data = fs.readFileSync('input.txt', 'utf8');

    const travelDiary = new Set(['0,0']);

    let tailLocation = {x: 0, y: 0};
    const headLocation = {x: 0, y: 0};

    data.split(/\r?\n/).forEach((line) => {
        const [direction, distance] = line.split(' ');
        const _distance = parseInt(distance, 10);

        for (let index = 0; index < _distance; index += 1) {
            switch (direction) {
                case 'U':
                    // move head up
                    headLocation.y += 1;
                    break;
                case 'D':
                    // move head down
                    headLocation.y -= 1;
                    break;
                case 'L':
                    // move head left
                    headLocation.x -= 1;
                    break;
                case 'R':
                    // move head right
                    headLocation.x += 1;
                    break;
            }
            tailLocation = moveTail(headLocation, tailLocation);
            travelDiary.add(`${tailLocation.x},${tailLocation.y}`);
        }
    });

    const end = Date.now();
    console.log({travelDiary: travelDiary.size, time: end - start})
}

main();

// return the new tail location
function moveTail(headLocation, tailLocation) {
    let newTailLocation = {...tailLocation};
    let xDiff = Math.abs(headLocation.x - tailLocation.x);
    let yDiff = Math.abs(headLocation.y - tailLocation.y);

    while (xDiff > 1 || yDiff > 1) {
        newTailLocation = moveX(headLocation, newTailLocation);
        newTailLocation = moveY(headLocation, newTailLocation);
        xDiff = Math.abs(headLocation.x - newTailLocation.x);
        yDiff = Math.abs(headLocation.y - newTailLocation.y);
    }
    return newTailLocation;
}

function moveX(headLocation, tailLocation) {
    const newTailLocation = {...tailLocation};
    let xDiff = Math.abs(headLocation.x - tailLocation.x);
    let yDiff = Math.abs(headLocation.y - tailLocation.y);
    while (xDiff > 1) {
        if (headLocation.x > tailLocation.x) {
            newTailLocation.x += 1;
        } else {
            newTailLocation.x -= 1;
        }
        if (yDiff >= 1) {
            if (headLocation.y > tailLocation.y) {
                newTailLocation.y += 1;
            } else {
                newTailLocation.y -= 1;
            }
        }
        xDiff = Math.abs(headLocation.x - newTailLocation.x);
    }
    return newTailLocation;
}

function moveY(headLocation, tailLocation) {
    const newTailLocation = {...tailLocation};
    let yDiff = Math.abs(headLocation.y - tailLocation.y);
    let xDiff = Math.abs(headLocation.x - tailLocation.x);
    while (yDiff > 1) {
        if (headLocation.y > tailLocation.y) {
            newTailLocation.y += 1;
        } else {
            newTailLocation.y -= 1;
        }
        if (xDiff >= 1) {
            if (headLocation.x > tailLocation.x) {
                newTailLocation.x += 1;
            } else {
                newTailLocation.x -= 1;
            }
        }
        yDiff = Math.abs(headLocation.y - newTailLocation.y);
    }
    return newTailLocation;
}

// part 1 = 6087
// part 2 = 
