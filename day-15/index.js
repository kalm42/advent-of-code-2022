const fs = require('fs');

function main() {
    const start = Date.now();
    const file = fs.readFileSync('./input.txt', 'utf8');
    const sensorsBeaconsEmpty = parse(file);

    // 5_870_800 covered locations
    // 10_908_230_916_597 frequency

    const frequencyMultiplier = 4_000_000;
    const limit = 4_000_000;
    const calculateFrequency = (x, y) => x * frequencyMultiplier + y;
    let x1 = 0;
    let y1 = null;

    while (y1 === null) {
        const tempYs = intersects(x1, sensorsBeaconsEmpty, limit);
        
        tempYs.forEach((ty) => {
            if (!isCoordinateCovered(x1, ty, sensorsBeaconsEmpty)) {
                y1 = ty;
            }
        });

        if (y1 === null) {
            x1 += 1;
        }
    }
    const end = Date.now();
    console.log({frequency: calculateFrequency(x1, y1), time: end - start});
}
main();

function intersects(x1, sensors, limit) {
    let does = new Set()
    
    sensors.forEach((point) => {
        const {x, y, md} = point;
        const pointA = {x: x - md, y};
        const pointB = {x: x, y: y + md};

        const mAB = (pointB.y - pointA.y) / (pointB.x - pointA.x);
        const bAB = (pointA.y - (pointA.x * mAB)) / 1;
        const yAB = mAB * x1 + bAB;
        if (yAB >= pointA.y && yAB <= pointB.y) {
            does.add(yAB);
        }

        const pointC = {x: x + md, y};
        const mBC = (pointC.y - pointB.y) / (pointC.x - pointB.x);
        const bBC = (pointB.y - (pointB.x * mBC)) / 1;
        const yBC = mBC * x1 + bBC;
        if (yBC <= pointB.y && yBC >= pointC.y) {
            does.add(yBC);
        }

        const pointD = {x, y: y - md};
        const mCD = (pointD.y - pointC.y) / (pointC.x - pointD.x);
        const bCD = (pointC.y - (pointC.x * mCD)) / 1;
        const yCD = mCD * x1 + bCD;
        if (yCD <= pointC.y && yCD >= pointD.y) {
            does.add(yCD);
        }
    });

    return [...does].map(y => y + 1).filter(y => y >= 0 && y <= limit);
}

function isCoordinateCovered(x, y, sensors) {
    let covered = false;
    sensors.forEach((point) => {
        if (!covered) {
            const {x: x2, y: y2, md} = point;
            if (Math.abs(x - x2) + Math.abs(y - y2) <= md) {
                covered = true;
            }
        }
    });
    return covered;
}



function parse(file) {
    const sensorsAndBeacons = new Map();
    file.split(/\r?\n/).forEach(line => {
        const [[x], [y], [bx], [by]] = line.matchAll(/(-?\d+)/g)
        const md = Math.abs(Number(x) - Number(bx)) + Math.abs(Number(y) - Number(by))
        
        sensorsAndBeacons.set(`${x},${y}`, {
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
