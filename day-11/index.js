
function main() {
    const start = Date.now();

    const monkeys = [
        {
            holds: [50, 70, 54, 83, 52, 78], 
            thaBusiness: (item) => (item * 3), 
            handOff: {[true]: 2, [false]: 7}, 
            test: (item) => (item % 11 === 0)
        },
        {
            holds: [71, 52, 58, 60, 71], 
            thaBusiness: (item) => (item * item), 
            handOff: {[true]: 0, [false]: 2}, 
            test: (item) => (item % 7 === 0)
        },
        {
            holds: [66, 56, 56, 94, 60, 86, 73], 
            thaBusiness: (item) => (item + 1), 
            handOff: {[true]: 7, [false]: 5}, 
            test: (item) => (item % 3 === 0)
        },
        {
            holds: [83, 99], 
            thaBusiness: (item) => (item + 8), 
            handOff: {[true]: 6, [false]: 4}, 
            test: (item) => (item % 5 === 0)
        },
        {
            holds: [98, 98, 79], 
            thaBusiness: (item) => (item + 3), 
            handOff: {[true]: 1, [false]: 0}, 
            test: (item) => (item % 17 === 0)
        },
        {
            holds: [76], 
            thaBusiness: (item) => (item + 4), 
            handOff: {[true]: 6, [false]: 3}, 
            test: (item) => (item % 13 === 0)
        },
        {
            holds: [52, 51, 84, 54], 
            thaBusiness: (item) => (item * 17), 
            handOff: {[true]: 4, [false]: 1}, 
            test: (item) => (item % 19 === 0)
        },
        {
            holds: [82, 86, 91, 79, 94, 92, 59, 94], 
            thaBusiness: (item) => (item + 7), 
            handOff: {[true]: 5, [false]: 3}, 
            test: (item) => (item % 2 === 0)
        },
    ];

    const countMonkeyBusiness = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
    }

    for (let index = 0; index < 10_000; index += 1) {
        monkeys.forEach((monkey, i) => {
            while (monkey.holds.length > 0) {
                let item = monkey.thaBusiness(monkey.holds.shift());
                item = item % 9_699_690; // the product of all the modulo values
                const nextMonkey = monkey.handOff[monkey.test(item)];
                monkeys[nextMonkey].holds.push(item);
                countMonkeyBusiness[i] += 1;
            }
        })
    }
    
    // 20 rounds of monkey business over, who are the top two monkeys?
    const topTwo = Object.entries(countMonkeyBusiness).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([_, count]) => count)
    const totalMonkeyBusiness = topTwo.reduce((acc, count) => acc * count, 1);

    const end = Date.now();
    console.log({totalMonkeyBusiness, time: end - start})
}
main();

// part 1 = 102_399
// part 2 = 23_641_658_401