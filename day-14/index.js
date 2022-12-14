const fs = require('fs');

// Coord = {x: number, y: number}

function main() {
    const start = Date.now();
    const file = fs.readFileSync('./input.txt', 'utf8');
    const sandPourCoordinate = {x: 500, y: 0};
    const sandGrainCoordinates = [];

    // parse the file into an array of coord sets
    const rockCoordinates = parse(file);

    // get the min and max coords
    const [min, max] = getMinMaxCoords(rockCoordinates);

    // drop sand and print the map until the sand falls off the map
    let intoTheAbyssWithYou = false;
    while(!intoTheAbyssWithYou) {
        const newSandGrainCoordinates = dropSand(rockCoordinates, sandGrainCoordinates, sandPourCoordinate, min, max);
        if (newSandGrainCoordinates) {
            sandGrainCoordinates.push(newSandGrainCoordinates);
            // sort the sand grains by x and then by y
            sandGrainCoordinates.sort((a, b) => a.x - b.x || a.y - b.y);
        } else {
            intoTheAbyssWithYou = true;
        }
    }
    
    console.log(printMap(rockCoordinates, sandGrainCoordinates, sandPourCoordinate))

    const end = Date.now();
    console.log({count: sandGrainCoordinates.length + 1, time: end - start});
}
main();

// returns end coordinate of sand or null if it falls off the map
function dropSand(rockCoordinates, sandGrainCoordinates, sandPourCoordinate, min, max) {
    // we start at the pour coordinate
    const currentPosition = {...sandPourCoordinate};
    let canMove = true;

    while(canMove) {
        // we go down until we hit a rock or the bottom of the map or another grain of sand
        // can we move down?
        switch (canMoveDown(currentPosition)) {
            // yes we can move down
            case 1:
                currentPosition.y += 1;
                continue;
            // we're going off the map
            case 0:
                canMove = false;
            // we hit another grain of sand or rock
            case -1:
            default:
                break;
        }

        // If we're here we can't move down, so check down and left
        switch (canMoveDownAndLeft(currentPosition)) {
            // yes we can move down and left
            case 1:
                currentPosition.y += 1;
                currentPosition.x -= 1;
                continue;
            // we're going off the map
            case 0:
                canMove = false;
            // we hit another grain of sand or rock
            case -1:
            default:
                break;
        }

        // If we're here we can't move down and left, so check down and right
        switch (canMoveDownAndRight(currentPosition)) {
            // yes we can move down and right
            case 1:
                currentPosition.y += 1;
                currentPosition.x += 1;
                continue;
            // we're going off the map
            case 0:
                canMove = false;
            // we hit another grain of sand or rock
            case -1:
            default:
                break;
        }
        canMove = false;

    }

    // if the currentSandPosition is the same as the sandPourCoordinate return null
    if (currentPosition.x === sandPourCoordinate.x && currentPosition.y === sandPourCoordinate.y) {
        return null;
    }

    return currentPosition;

    // closure functions
    function inBounds(a) {
        // is coordinate a  <= min or >= max
        const floor = max.y;
        return a.y < min.y || a.y > floor ? 0 : 1;
    }

    function check(b) {
        if (sandGrainCoordinates.some(coord => coord.x === b.x && coord.y === b.y)) {
            return -1;
        }
        // if down is in the rock coordinates return false
        if (rockCoordinates.some(coord => coord.x === b.x && coord.y === b.y)) {
            return -1;
        }
        return inBounds(b);
    }

    function canMoveDown(a) {
        const b = {x: a.x, y: a.y + 1};
        return check(b);
    }

    function canMoveDownAndLeft(a) {
        const b = {x: a.x - 1, y: a.y + 1};
        return check(b);
    }

    function canMoveDownAndRight(a) {
        const b = {x: a.x + 1, y: a.y + 1};
        return check(b);
    }
    // if we hit another grain of sand the grain of sand or rock
        // the sand will attempt to go down one and to the left one
        // if it can't go down and to the left attempt to go down and to the right
        // if it can't stop
    // if we hit the bottom of the map the grain of sand falls off the map return null
    
}

function parse(file) {
    return file.split(/\r?\n/).map(line => (
        line.split('->').map(s => s.trim()).map(point => {
            const [x, y] = point.split(',').map(s => s.trim());
            
            const coord = {x: parseInt(x), y: parseInt(y)};
            if (isNaN(coord.x) || isNaN(coord.y)) {
                throw new Error(`Invalid coord: ${c}`);
            }

            return coord;
        }).reduce((setOfVertices, vertice, index, full) => {
            // get current and next vertices
            const current = {...vertice};
            const next = full[index + 1];

            // if there is a next vertice
            if (next) {
                // fill in gaps between the two vertices
                const [minY, maxY] = [current, next].sort((a, b) => a.y - b.y);
                const [minX, maxX] = [current, next].sort((a, b) => a.x - b.x);
                for (let y = minY.y; y <= maxY.y; y += 1) {
                    setOfVertices.push({x: current.x, y});
                }
                for (let x = minX.x; x <= maxX.x; x += 1) {
                    setOfVertices.push({x, y: current.y});
                }
            } else {
                // add the vertice to the set
                setOfVertices.push(current);
            }
            return setOfVertices;
        }, [])
    )).map((set) => set.filter((a, _, coords) => (
        coords.findIndex(b => a.x === b.x && a.y === b.y) === coords.lastIndexOf(a)
    ))).reduce((a, b) => a.concat(b), []);
}

function getMinMaxCoords(coordSets) {
    // upper left corner is should be the lowest x and y
    // lower right corner is the highest x and y
    const min = {x: Infinity, y: 0};
    const max = {x: 0, y: 0};

    coordSets.forEach(coord => {
        if (coord.x < min.x) {
            min.x = coord.x;
        }
        if (coord.y < min.y) {
            min.y = coord.y;
        }
        if (coord.x > max.x) {
            max.x = coord.x;
        }
        if (coord.y > max.y) {
            max.y = coord.y;
        }
    });

    min.x -= 1;
    max.x += 1;
    max.y += 1;

    return [min, max];
}

function printMap(rockCoords, sandCoords, sandPourCoord) {
    const [min, max] = getMinMaxCoords(rockCoords.concat(sandCoords));
    let map = '';
    let flatRockCoordSets = [];
    rockCoords.forEach(coordSet => {
        flatRockCoordSets = flatRockCoordSets.concat(coordSet);
    });
    let flatSandCoordSets = [];
    sandCoords.forEach(coordSet => {
        flatSandCoordSets = flatSandCoordSets.concat(coordSet);
    });

    let cursor = {x: min.x, y: min.y};

    for (let yIndex = min.y; yIndex < max.y; yIndex += 1) {
        // x
        for (let index = min.x; index < max.x; index++) {
            // is the cursor coord in the coord set?
            const isRock = flatRockCoordSets.some(coord => coord.x === cursor.x && coord.y === cursor.y);
            const isSand = flatSandCoordSets.some(coord => coord.x === cursor.x && coord.y === cursor.y);
            const isSandPour = sandPourCoord.x === cursor.x && sandPourCoord.y === cursor.y;

            if (isSandPour) {
                map += '+';
            } else if (isRock) {
                map += '#';
            } else if (isSand) {
                map += 'o';
            } else {
                map += '.';
            }
            const tempX = (cursor.x + 1) % max.x;
            cursor.x = tempX < min.x ? min.x : tempX;
        }
        map += '\n';
        cursor.y = (cursor.y + 1) % max.y
    }
    // Add some line breaks for separation
    map += '\n\n';
    return map;
}

// part 1 1330
// part 2 7338