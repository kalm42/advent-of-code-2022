use std::fs::File;
 use std::io::{self, BufRead};
 use std::path::Path;
 use std::time::Instant;

 fn main() {
     let start = Instant::now();
     let mut total_part_1 = 0;
     let mut total_part_2 = 0;
     // File hosts must exist in current path before this produces output
     if let Ok(lines) = read_lines("./rock-paper-scissors.txt") {
         // Consumes the iterator, returns an (Optional) String
         for line in lines {
             if let Ok(ip) = line {
                 let (elf_a, elf_b) = get_game(&ip);
                 let game = score_game(elf_a, elf_b);
                 total_part_1 += game;
                 let elf_c = match elf_b { // x = rock, y = paper, z = scissors
                     "X" => match elf_a {
                         "A" => "Z", // rock
                         "B" => "X", // paper
                         "C" => "Y", // scissors
                         _ => "Z", // default
                     }, // need to lose
                     "Y" => match elf_a {
                         "A" => "X", // rock
                         "B" => "Y", // paper
                         "C" => "Z", // scissors
                         _ => "Z", // default
                     }, // need to tie
                     "Z" => match elf_a {
                         "A" => "Y", // rock
                         "B" => "Z", // paper
                         "C" => "X", // scissors
                         _ => "Z", // default
                     }, // need to win
                     _ => "Z", //default
                 };
                 let game_2 = score_game(elf_a, elf_c);
                 total_part_2 += game_2;
             }
         }
     }
     let duration = start.elapsed();
     println!("Part 1 Total: {}", total_part_1);
     println!("Part 2 Total: {}", total_part_2);
     println!("Time elapsed is: {:?}", duration);
 }

 // Read the lines from the file.
 fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
 where P: AsRef<Path>, {
     let file = File::open(filename)?;
     Ok(io::BufReader::new(file).lines())
 }

 fn get_game(game: &String) -> (&str, &str) {
     let mut elf_a: &str = "";
     let mut elf_b: &str = "";

     for play in game.split_whitespace() {
         if elf_a == "" {
             elf_a = play.clone();
         } else {
             elf_b = play.clone();
         }
     }
     (elf_a, elf_b)
 }

 fn score_game(elf_a: &str, elf_b: &str) -> i32 {
     let win = 6;
     let tie = 3;
     let lose = 0;
     let mut score = 0;

     score += match elf_b {
         "X" => 1, // rock
         "Y" => 2, // paper
         "Z" => 3, // scissors
         _ => 0,
     };

     let play = format!("{}{}", elf_a, elf_b);
     score += match play.as_str() {
         "AX" => tie, // rock rock
         "AY" => win, // rock paper
         "AZ" => lose, // rock scissors
         "BX" => lose, // paper rock
         "BY" => tie, // paper paper
         "BZ" => win, // paper scissors
         "CX" => win, // scissors rock
         "CY" => lose, // scissors paper
         "CZ" => tie, // scissors scissors
         _ => 0,
     };

     return score;
 }