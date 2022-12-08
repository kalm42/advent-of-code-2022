const fs = require('fs');

function main() {
    const dataa = fs.readFileSync('input.txt', 'utf8');

    let numberOfTreesVisible = 0;
    let x = 0;
    let y = 0;
    const map = dataa.split(/\r?\n/).map((y) => y.split('').map((x) => parseInt(x)));

    while (y < map.length) {
        let isVisible = false;
        if (lookUp(map, x, y, map[y][x])) {
            isVisible = true
        }

        if (!isVisible && lookDown(map, x, y, map[y][x])) {
            isVisible = true
        }

        if (!isVisible && lookLeft(map, x, y, map[y][x])) {
            isVisible = true
        }

        if (!isVisible && lookRight(map, x, y, map[y][x])) {
            isVisible = true
        }
        
        if (isVisible) {
            numberOfTreesVisible += 1;
        }

        if (inBounds(map, x + 1, y)) {
            x += 1;
        } else {
            x = 0;
            y += 1;
        }
    }

    console.log({numberOfTreesVisible});

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
            return lookUp(map, x, up, currentTree)
        }
        return false;
    };

    return true;
}

function lookDown(map, x, y, currentTree) {
    // needs to travel from current location to the bottom of the map
    const down = y + 1;

    // is down in bounds?
    if (inBounds(map, x, down)) {
        const downTree = map[down][x];
        if (downTree < currentTree) {
            return lookDown(map, x, down, currentTree)
        }
        return false;
    }

    return true;
}

function lookLeft(map, x, y, currentTree) {
    // needs to travel from current location to the left of the map
    const left = x - 1;

    // is left in bounds?
    if (inBounds(map, left, y)) {
        const leftTree = map[y][left];
        if (leftTree < currentTree) {
            return lookLeft(map, left, y, currentTree)
        }
        return false;
    }

    return true;
}

function lookRight(map, x, y, currentTree) {
    // needs to travel from current location to the right of the map
    const right = x + 1;

    // is right in bounds?
    if (inBounds(map, right, y)) {
        const rightTree = map[y][right];
        if (rightTree < currentTree) {
            return lookRight(map, right, y, currentTree)
        }
        return false;
    }

    return true;
}

// part 1 = 1_533
// part 2 = 
