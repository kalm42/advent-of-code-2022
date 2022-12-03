const fs = require('fs');

function main() {
    const start = Date.now();
    const bindlesRaw = fs.readFileSync('./bindles.txt', 'utf-8');
    // a-z = 1-26 A-Z = 27-52
    // return the sum of the duplacates
    let sum = 0;
    let badgeSum = 0;
    const letterValues = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        f: 6,
        g: 7,
        h: 8,
        i: 9,
        j: 10,
        k: 11,
        l: 12,
        m: 13,
        n: 14,
        o: 15,
        p: 16,
        q: 17,
        r: 18,
        s: 19,
        t: 20,
        u: 21,
        v: 22,
        w: 23,
        x: 24,
        y: 25,
        z: 26,
        A: 27,
        B: 28,
        C: 29,
        D: 30,
        E: 31,
        F: 32,
        G: 33,
        H: 34,
        I: 35,
        J: 36,
        K: 37,
        L: 38,
        M: 39,
        N: 40,
        O: 41,
        P: 42,
        Q: 43,
        R: 44,
        S: 45,
        T: 46,
        U: 47,
        V: 48,
        W: 49,
        X: 50,
        Y: 51,
        Z: 52,
    }

    const bags = bindlesRaw.split(/\r?\n/)
    
    bags.forEach((bag) => {
        // first half is first compartment, second half is second compartment
        // compare the two compartments find duplicates
        const firstHalf = bag.slice(0, bag.length / 2).split('');
        const secondHalf = bag.slice(bag.length / 2);
        const duplicates = new Set(
            ...firstHalf.filter((letter) => secondHalf.includes(letter))
        );
        sum += Array.from(duplicates).reduce((acc, letter) => acc + letterValues[letter], 0);
    });

    // in each set of 3 lines, find the duplicate in all lines
    for (let index = 0; index < bags.length; index += 3) {
        const firstLine = bags[index].split('');
        const secondLine = bags[index + 1].split('');
        const thirdLine = bags[index + 2].split('');
        const duplicates = new Set(
            ...firstLine.filter((letter) => secondLine.includes(letter) && thirdLine.includes(letter))
        );
        badgeSum += Array.from(duplicates).reduce((acc, letter) => acc + letterValues[letter], 0);
    }
    const end = Date.now();
    console.log({sum, badgeSum, time: end - start});
}

main();