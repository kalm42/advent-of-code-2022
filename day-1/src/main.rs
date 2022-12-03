use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

fn main() {
    // vector of i32 elf calorie counts
    let mut elf_calories: Vec<i32> = Vec::new();
    // big bucket
    let mut big_total: i32 = 0;
    // little bucket
    let mut running_total = 0;
     // read over the file, line by line
    if let Ok(lines) = read_lines("./elves.txt") {
        for line in lines {
            if let Ok(ip) = line {
                 // convert string to int and if it's a number, add it to the running total
                // else, pack up and check the running total against the largest to date
                let calories:i32 = match ip.parse() {
                    Ok(calories) => calories,
                    Err(_) => pack_up(&mut elf_calories, &mut big_total, &mut running_total),
                };
                 running_total += calories;
            }
        }
        println!("Most calories: {}", big_total);
        println!("Elf calories: {:?}", elf_calories);
        let top_three = digest(&elf_calories);
        println!("Top three: {}", top_three);
    };

}
 // Read the lines from the file.
fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where P: AsRef<Path>, {
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
 // Pack up the running total and check it against the largest to date
fn pack_up(elves: &mut Vec<i32>, big: &mut i32, small: &mut i32) -> i32 {
    // big should be the smallest number currently in the vector
     // if small is larger than the last item in the vector, add it to the vector
    let last:i32 = match elves.last() {
        Some(last) => *last,
        None => 0,
    };
     if *small > last {
        let mut insert_here: usize = elves.len();
        // loop through and find the index to insert the number at.
        for (i, elf) in elves.iter_mut().enumerate() {
            if *small > *elf && i < insert_here {
                insert_here = i;
            }
        }
         elves.insert(insert_here, *small);
    }
     // if the vector is larger than 3, remove the smallest number
    if elves.len() > 3 {
        elves.remove(elves.len() - 1);
    }
     *big = if small >= big { *small } else { *big };
    *small = 0;
    return 0
}

fn digest(elves: &Vec<i32>) -> i32 {
    let mut total: i32 = 0;
    for elf in elves {
        total += elf;
    }
    return total;
}
