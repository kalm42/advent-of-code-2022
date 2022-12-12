const fs = require('fs');

function main() {
    const start = Date.now();
    const map = [];
    const queue = [];
    const traveled = {};
    let rows = 0;
    let cols = 0;
    let startingPoint;
    let endingPoint;

    fs.readFileSync('./input.txt', 'utf8')
        .split(/\r?\n/)
        .forEach((line, y, lines) => {
            if (rows === 0) {
                rows = lines.length;
            }
            const row = line.trim().split('');
            if (cols === 0) {
                cols = row.length;
            }

            // get starting point
            const x = row.indexOf('S');
            if (x > -1) {
                startingPoint = {x, y, steps: 0, travelDiary: [{x, y}]};
            }

            // get ending point
            const e = row.indexOf('E');
            if (e > -1) {
                endingPoint = {x: e, y};
            }

            // add to map
            map.push(row);
    })

    // Add starting point to queue
    queue.push(startingPoint);
    traveled[[startingPoint.x, startingPoint.y].join(',')] = true;

    while (queue.length > 0) {
        const {x, y, steps, travelDiary} = queue.shift();
        
        // if (x === 90 && y === 20) {
        //     debugger
        // }

        // If we're at the end, return the number of steps
        if (x === endingPoint.x && y === endingPoint.y) {
            console.log({steps, time: Date.now() - start});
            travelDiary.forEach((travel) => {
                console.log(`(${travel.x}, ${travel.y}): ${map[travel.y][travel.x]}`)
            })
            return;
        }

        // get the value of the current location
        const currentValue = (map[y][x] === 'S' ? 'a' : map[y][x]).charCodeAt(0);

        // travel up
        if ((y - 1) >= 0 && !traveled[[x, y - 1].join(',')]) {
            const upValue = map[y - 1][x].charCodeAt(0);
            if (canTravel(currentValue, upValue)) {
                queue.push({x, y: y - 1, steps: steps + 1, travelDiary: [...travelDiary, {x, y: y - 1}]});
                traveled[[x, y - 1].join(',')] = true;
            }
        }

        // travel down
        if ((y + 1) < rows && !traveled[[x, y + 1].join(',')]) {
            const downValue = map[y + 1][x].charCodeAt(0);
            if (canTravel(currentValue, downValue)) {
                queue.push({x, y: y + 1, steps: steps + 1, travelDiary: [...travelDiary, {x, y: y + 1}]});
                traveled[[x, y + 1].join(',')] = true;
            }
        }

        // travel left
        if ((x - 1) >= 0 && !traveled[[x - 1, y].join(',')]) {
            const leftValue = map[y][x - 1].charCodeAt(0);
            if (canTravel(currentValue, leftValue)) {
                queue.push({x: x - 1, y, steps: steps + 1, travelDiary: [...travelDiary, {x: x - 1, y}]});
                traveled[[x - 1, y].join(',')] = true;
            }
        }

        // travel right
        if ((x + 1) < cols && !traveled[[x + 1, y].join(',')]) {
            const rightValue = map[y][x + 1].charCodeAt(0);
            if (canTravel(currentValue, rightValue)) {
                queue.push({x: x + 1, y, steps: steps + 1, travelDiary: [...travelDiary, {x: x + 1, y}]});
                traveled[[x + 1, y].join(',')] = true;
            }
        }

        queue.sort((a, b) => a.steps - b.steps);
    }
}

function canTravel(whereIam, whereIWantToGo) {
    if (whereIWantToGo === 69) {
        return whereIam === 122;
    } else {
        return (whereIWantToGo - whereIam) < 2;
    }
}

main();
