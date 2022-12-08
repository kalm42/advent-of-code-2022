const fs = require('fs');

function main() {
    const dataa = fs.readFileSync('input.txt', 'utf8');

    let x = 0;
    let y = 0;
    const map = dataa.split(/\r?\n/).map((y) => y.split('').map((x) => parseInt(x)));

    let highScenicScore = 0;

    while (y < map.length) {
        const up = lookUp(map, x, y, map[y][x]);

        const down = lookDown(map, x, y, map[y][x])

        const left = lookLeft(map, x, y, map[y][x])

        const right = lookRight(map, x, y, map[y][x])
        
        const total = up * left * right * down;

        if (total > highScenicScore) {
            highScenicScore = total;
        }

        if (inBounds(map, x + 1, y)) {
            x += 1;
        } else {
            x = 0;
            y += 1;
        }
    }

    console.log({highScenicScore});

}
main();

function inBounds(map, x, y) {
    return x >= 0 && y >= 0 && y < map.length && x < map[y].length;
}

function lookUp(map, x, y, currentTree) {
    // needs to travel from current location to the top of the map
    const up = y - 1;

    // is up in bounds?
    if (inBounds(map, x, up)) {
        const upTree = map[up][x];
        if (upTree < currentTree) {
            return 1 + lookUp(map, x, up, currentTree)
        }
        return 1;
    };

    return 0
}

function lookDown(map, x, y, currentTree) {
    // needs to travel from current location to the bottom of the map
    const down = y + 1;

    // is down in bounds?
    if (inBounds(map, x, down)) {
        const downTree = map[down][x];
        if (downTree < currentTree) {
            return 1 + lookDown(map, x, down, currentTree)
        }
        return 1;
    }

    return 0;
}

function lookLeft(map, x, y, currentTree) {
    // needs to travel from current location to the left of the map
    const left = x - 1;

    // is left in bounds?
    if (inBounds(map, left, y)) {
        const leftTree = map[y][left];
        if (leftTree < currentTree) {
            return 1+ lookLeft(map, left, y, currentTree)
        }
        return 1
    }

    return 0
}

function lookRight(map, x, y, currentTree) {
    // needs to travel from current location to the right of the map
    const right = x + 1;

    // is right in bounds?
    if (inBounds(map, right, y)) {
        const rightTree = map[y][right];
        if (rightTree < currentTree) {
            return 1 + lookRight(map, right, y, currentTree)
        }
        return 1
    }

    return 0
}

// part 1 = 1_533
// part 2 = 345_744
