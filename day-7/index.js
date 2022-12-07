const fs = require('fs');

function main() {
    const start = Date.now();

    const file = fs.readFileSync('./input.txt', 'utf8');

    const directories = {}
    let currentDirectory = ""
    file.split(/\r?\n/).forEach((line, lineNumber, allLines) => {
        const _line = line.trim();

        if (_line.startsWith('$', )) {
            if (_line.startsWith("cd", 2)) {
                // I need to change directories
                const directory = _line.split(' ')[2];
                if (directory === "..") {
                    // go up a directory
                    const bits = currentDirectory.split('/').filter((bit) => bit !== '');
                    bits.pop();
                    currentDirectory = "/" + bits.join('/');
                } else {
                    currentDirectory = currentDirectory.endsWith('/') || currentDirectory.length < 1 ? (currentDirectory + directory) : (currentDirectory + '/' + directory);
                }
            }

            if (_line.startsWith("ls", 2)) {
                // I need to gather all the lines until the next $ command
                const directory = [];
                let i = lineNumber + 1;
                let subline = allLines[i].trim();
                while (!subline.startsWith('$') && i < allLines.length) {
                    directory.push(subline);
                    i += 1;
                    if (i < allLines.length) {
                        subline = allLines[i].trim();
                    }
                }
                const bits = sumDirectory(directory, currentDirectory);
                directories[currentDirectory] = bits;
                // establish sub directories
            }
        }
    })

    // Okay I have all the directories and file sizes mapped out, now to sum them, kinda
    Object.keys(directories).forEach((directory) => {
        // debugger
        if (directories[directory].sub.length > 0) {
            // has sub directories
            directories[directory].sub.forEach((subDirectory) => {
                directories[directory].size += addSize(subDirectory, directories)
            })
        }
    })

    // Now they're all added up we can filer and sum.
    const totalPart1 = Object.keys(directories).reduce((runningTotal, directory) => {
        if (directories[directory].size <= 100_000) {
            runningTotal += directories[directory].size;
        }
        return runningTotal;
    }, 0);

    // Part 2
    const totalDiskSpace = 70_000_000;
    const currentFreeSpace = totalDiskSpace - directories['/'].size;
    const need = 30_000_000 - currentFreeSpace;
    const totalPart2 = Object.keys(directories).reduce((runningTotal, directory) => {
        const size = directories[directory].size;
        if (size >= need && size <= runningTotal) {
            return size;
        } else {
            return runningTotal;
        }
    }, totalDiskSpace);

    const end = Date.now();
    console.log({ totalPart1, totalPart2, time: end - start});
}

// return size of directory
function addSize(directory, directories) {
    let size = 0;
    if (!directories[directory]) return size
    if (directories[directory].sub.length > 0) {
        // has sub directories
        directories[directory].sub.forEach((subDirectory) => {
            size += addSize(subDirectory, directories)
        });
    }
    return size + directories[directory].size;
}

function sumDirectory(directory, currentDirectory) {
    // directory will be an array of strings representing files and directories
    // return the sum of the file sizes in the strings
    return directory.reduce((meta, line) => {
        const _line = line.trim();
        const [first, second] = _line.split(' ');
        if (!isNaN(parseInt(first))) {
            meta.size += parseInt(first);
        } else {
            let path = currentDirectory.endsWith('/') ? (currentDirectory + second) : (currentDirectory + '/' + second);
            meta.sub.push(path)
        }
        return meta;
    }, {size: 0, sub: []})
}

main();

// part 1 = 1_581_595
// part 2 = 1_544_176