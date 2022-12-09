const fs = require('fs');

function main() {
    const start = Date.now();
    const data = fs.readFileSync('input.txt', 'utf8');

    const travelDiary = new Set(['0,0']);

    let knots = new Array(10).fill('').map((knot) => ({x: 0, y: 0})).map((knot, i, rope) => {
        // Assign each knot a reference to the next knot
        if (i < rope.length - 1) {
            knot.next = rope[i + 1];
        }
        return knot;
    })

    data.split(/\r?\n/).forEach((line) => {
        const [direction, distance] = line.split(' ');
        const _distance = parseInt(distance, 10);

        for (let index = 0; index < _distance; index += 1) {
            switch (direction) {
                case 'U':
                    // move head up
                    knots[0].y += 1;
                    break;
                case 'D':
                    // move head down
                    knots[0].y -= 1;
                    break;
                case 'L':
                    // move head left
                    knots[0].x -= 1;
                    break;
                case 'R':
                    // move head right
                    knots[0].x += 1;
                    break;
            }
            knots = moveTail(knots);
            travelDiary.add(`${knots.at(-1).x},${knots.at(-1).y}`);
        }
    });

    const end = Date.now();
    console.log({travelDiary: travelDiary.size, knots, time: end - start})
}

main();

// return the new tail location
function moveTail(knots) {
    return knots.map((knot, index, rope) => {
        // knot is the current knot, it's location was updated by the previous run
        // We will use it's current location to update the knots behind it.
        // early exit if we are at the end of the rope
        if (index === rope.length - 1) return knot;

        // get the next knot, I hope this mutates the array
        let nextKnot = rope[index + 1];
        let xDiff = Math.abs(knot.x - nextKnot.x);
        let yDiff = Math.abs(knot.y - nextKnot.y);
    
        while (xDiff > 1 || yDiff > 1) {
            moveX(knot);
            moveY(knot);
            xDiff = Math.abs(knot.x - nextKnot.x);
            yDiff = Math.abs(knot.y - nextKnot.y);
        }
        return knot;
    });

}

function moveX(knot) {
    let xDiff = Math.abs(knot.x - knot.next.x);
    let yDiff = Math.abs(knot.y - knot.next.y);
    while (xDiff > 1) {
        if (knot.x > knot.next.x) {
            knot.next.x += 1;
        } else {
            knot.next.x -= 1;
        }
        if (yDiff >= 1) {
            if (knot.y > knot.next.y) {
                knot.next.y += 1;
            } else {
                knot.next.y -= 1;
            }
        }
        xDiff = Math.abs(knot.x - knot.next.x);
    }
}

function moveY(knot) {
    let yDiff = Math.abs(knot.y - knot.next.y);
    let xDiff = Math.abs(knot.x - knot.next.x);
    while (yDiff > 1) {
        if (knot.y > knot.next.y) {
            knot.next.y += 1;
        } else {
            knot.next.y -= 1;
        }
        if (xDiff >= 1) {
            if (knot.x > knot.next.x) {
                knot.next.x += 1;
            } else {
                knot.next.x -= 1;
            }
        }
        yDiff = Math.abs(knot.y - knot.next.y);
    }
}

// part 1 = 6087
// part 2 = 
