const fs = require('fs');

function main() {
    const start = Date.now();
    const file = fs.readFileSync('./input.txt', 'utf8');
    const sensorsBeaconsEmpty = parse(file);

    // given a sensor and beacon, the beacon is a manhattan distance from the 
    // sensor, gather all coordinates that are of the same manhattan distance 
    // or less
    // Instead of filling in all the blanks and counting them
    // I'll just count the 1 y-axis and check if that point is not a sensor, a
    // beacon, or within the manhattan distance of a sensor and it's beacon.

    // 5_851_900 to low
    // 5_870_800
    // 10_548_183 too high

    const { minX, maxX } = getMinMaxXY(sensorsBeaconsEmpty);

    const y = 2_000_000;
    let count = 0;
    for (let x = minX; x < maxX; x += 1) {
        let shouldCount = false;
        sensorsBeaconsEmpty.forEach((point) => {
            if (!shouldCount) {
                const {x: x1, y: y1} = point;
                const {x: x2, y: y2} = point.beacon;
                const mdOfSensorToBeacon = point.md;
                const mdOfHereToSensor = Math.abs(x - x1) + Math.abs(y - y1);
                if (
                    mdOfHereToSensor <= mdOfSensorToBeacon 
                    && (x !== x1 || y !== y1)
                    && (x !== x2 || y !== y2)
                ) {
                    shouldCount = true;
                }
            }
        });
        if (shouldCount) {
            count += 1;
        }
    }

    // make map, then count negative values for one y axis
    // console.log(printMap(sensorsBeaconsEmpty));

    const end = Date.now();
    console.log({count, time: end - start});
}
main();

function parse(file) {
    const sensorsAndBeacons = new Map();
    file.split(/\r?\n/).forEach(line => {
        const [[x], [y], [bx], [by]] = line.matchAll(/(-?\d+)/g)
        const md = Math.abs(Number(x) - Number(bx)) + Math.abs(Number(y) - Number(by))
        
        sensorsAndBeacons.set(`${x},${y},${md}`, {
            x: Number(x), 
            y: Number(y), 
            type: 'sensor',
            md,
            beacon: {
                x: Number(bx),
                y: Number(by),
            }
        });
    });
    return sensorsAndBeacons;
}

// return {minX, maxX, minY, maxY}
function getMinMaxXY(coordinateSets) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let minMd = Infinity;
    let maxMd = -Infinity;

    coordinateSets.forEach((point) => {
        // I need to offset the mins and maxes by the point's manhattan distance
        // from the sensor and beacon
        const {md} = point;

        minX = Math.min(minX, point.x - md);
        maxX = Math.max(maxX, point.x + md);
        minY = Math.min(minY, point.y - md);
        maxY = Math.max(maxY, point.y + md);
        minMd = Math.min(minMd, md);
        maxMd = Math.max(maxMd, md);
    });

    return {minX, maxX, minY, maxY, minMd, maxMd};
}

// function printMap(coordinateSets) {
//     const {minX, maxX, minY, maxY} = getMinMaxXY(coordinateSets);
//     let map = '';

//     // y axis
//     for (let y = minY; y <= maxY; y += 1) {
//         // x axis
//         for (let x = minX; x <= maxX; x += 1) {
//             const point = coordinateSets.has(`${x},${y}`) ? coordinateSets.get(`${x},${y}`) : {type: ''};
//             switch (point.type) {
//                 case 'sensor':
//                     map += 'S';
//                     break;
//                 case 'beacon':
//                     map += 'B';
//                     break;
//                 case 'empty':
//                     map += '#';
//                     break;
//                 default:
//                     map += '.';
//                     break;
//             }
//         }
//         map += '\n';
//     }
//     return map;
// }
