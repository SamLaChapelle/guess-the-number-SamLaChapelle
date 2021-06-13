/*---------------------------------------------------/
 * Guess-the-Number Game that employs Math library
 * randomization functions & Readline library with async
 * functions/await ask key words.
 * Author; Sam L.
 *----------------------------------------------------*/

//-------Accessing the Readline Library-------//

const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//-------Game Choice Function-------//

whichGame();
//function to ask player which game they would like to play
async function whichGame() {
  let gameChoice = await ask(
    "Would you like to play the normal game(computer guesses)(type normal)? or the reverse game(you guess)(type reverse)?\n"
  );
  // if they choose the normal game then it is called, if they choose the reverse game then that is called.
  if (gameChoice.toLowerCase().includes("n")) {
    start();
  } else if (gameChoice.toLowerCase().includes("r")) {
    reverse();
  }
}

//-------Original Game play function-------//

//start of the function printing "Lets play a game..."
async function start() {
  //Smart Random Number Generator (finds the middle of the range)
  function randomNum(min, max) {
    let range = Math.floor((max + min) / 2);
    return range;
  }

  //start of the function printing "Lets play a game..."
  console.log(
    "Let's play a game where you (human) pick a number between 1-(a range of your choosing) and I (computer) try to guess.\n"
  );

  //three variables attaining the values for the min, max and the random number guessed
  let min = 1;
  let max = await ask(
    "Please enter the max range you would like. ex.(1-100).\n"
  );
  max = parseInt(max);
  let compGuess = randomNum(min, max);

  //assigning the variable secret number to the value of the players answer
  let secretNumber = await ask(
    "What is your secret number?\nI won't peek, I promise...\n"
  );

  //while loop to check/filter any user input values that aren't numbers
  while (isNaN(parseInt(secretNumber))) {
    secretNumber = await ask("Let's try that again. Please enter a number.\n");
  }

  //telling the player what number they chose
  console.log("You entered: " + secretNumber);

  //asking the player is the first random number is their number and assigning that value to userInput
  let userInput = await ask(`Is ${compGuess} your number?\n`);

  //declared variable "tries" assigned to 0
  let tries = 0;

  //a while loop that contains the cases for if the computer guesses the right number, higher or lower questions & three cheater cases
  while (compGuess !== secretNumber) {
    //adds 1 to variable tries every time the loop is ran
    tries++;

    //if the computer guesses the number a victory message is displayed
    if (userInput.toLowerCase().includes("y")) {
      break;

      //Cheater cases compare for range disfunction & lying on final guessed number(computer actually guessed their number)
    } else if (
      parseInt(secretNumber) === compGuess &&
      userInput.toLowerCase().includes("n")
    ) {
      console.log(
        "NO ONE MOVE! We have a cheater amongst us... you don't get to play again."
      );
      process.exit();

      //if player cheats by not answering the higher or lower questions truthfully, then displays message and quits
    } else if (
      (parseInt(secretNumber) > compGuess &&
        userInput.toLowerCase().includes("l")) ||
      (parseInt(secretNumber) < compGuess &&
        userInput.toLowerCase().includes("h"))
    ) {
      console.log(
        "NO ONE MOVE! We have a cheater amongst us... you don't get to play again."
      );
      process.exit();

      //if the computer guesses wrong it prints a question for higher(H) or lower(L)
    } else if (userInput.toLowerCase().includes("n")) {
      userInput = await ask(
        `Is your number Higher(H) or Lower(L) than ${compGuess}?\n`
      );
    }
    //if the player says its higher then the min is reassigned to the last number guessed + 1 and then ran through the randomNum generator again and guesses the new number generated
    if (userInput.toLowerCase().includes("h")) {
      min = compGuess + 1;
      compGuess = randomNum(min, max);
      userInput = await ask(`Is ${compGuess} your number?\n`);

      //if the player says its lower then the min is reassigned to the last number guessed - 1 and then ran through the randomNum generator again and guesses the new number generated
    } else if (userInput.toLowerCase().includes("l")) {
      max = compGuess - 1;
      compGuess = randomNum(min, max);
      userInput = await ask(`Is ${compGuess} your number?\n`);
    }
  }

  //victory display message and asks if the player would like to play again
  console.log(
    `HA! You silly goose, you thought I couldn't guess that? It only took me ${tries} tries!\n`
  );
  let playAgain = await ask("Would you like to play again? yes? or No?\n");

  playAgain.toLowerCase().includes("y") ? start() : process.exit();
}

//-------Reverse Game play function-------//

//variables stating the min and max
let min = 1;
let max = 100;

async function reverse() {
  //start of the function printing "Lets play a game..."
  console.log(
    "Let's play a game where I (computer) pick a random number between 1-100 and you (human) try to guess it!"
  );

  //random number generator for the computer to pick a random number between 1-100
  function randomNum(min, max) {
    range = Math.floor(Math.random() * (max - min + 1) + min);
    return range;
  }
  //two variables for the computers random secret number & the players guess "userInput"
  let compNum = randomNum(min, max);
  let userInput = await ask("Now make a guess between 1-100... ");

  //while loop that contains if the player guessed the right number & if the player guessed the wrong number they can guess again after the computer tell the player if the number is higher or lower than the previous guess
  while (true) {
    if (parseInt(userInput) === compNum) {
      console.log("Holy Crap! You guessed it!");
      break;
    } else if (parseInt(userInput) >= compNum) {
      console.log("WRONG! My number is lower!");
      userInput = await ask("Pick another number... ");
    } else if (parseInt(userInput) <= compNum) {
      console.log("WRONG! My number is higher!");
      userInput = await ask("Pick another number.. ");
    }
  }

  //variable playAgain stores the users answer to "If the would like to play again". If yes then the reverse game is called, if no then it exits
  let playAgain = await ask("Would you like to play again? yes? or No?\n");
  playAgain.toLowerCase().includes("y") ? reverse() : process.exit();
}
