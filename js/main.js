document.addEventListener("DOMContentLoaded", () => {
   createSquares();
   getNewWord();
 
   let guessedWords = [[]];
   let availableSpace = 1;
 
   
   let word = "HELLO";
   let guessedWordCount = 0;
 
   const keys = document.querySelectorAll(".keyboard-row button");
 
   async function getNewWord() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/ShibuInu/abacadaba/main/js/words.txt');
      const wordsText = await response.text();
      const wordsArray = wordsText.split('\n');
      const randomIndex = Math.floor(Math.random() * wordsArray.length);
      word = wordsArray[randomIndex].trim().toLowerCase();
  
      console.log("Selected word:", word); // Print the selected word to the console
    } catch (error) {
      console.error('Error fetching or processing the word:', error);
    }
  }

   function getCurrentWordArr() {
     const numberOfGuessedWords = guessedWords.length;
     return guessedWords[numberOfGuessedWords - 1];
   }
 
   function updateGuessedWords(letter) {
     const currentWordArr = getCurrentWordArr();
 
     if (currentWordArr && currentWordArr.length < 5) {
       currentWordArr.push(letter);
 
       const availableSpaceEl = document.getElementById(String(availableSpace));
 
       availableSpace = availableSpace + 1;
       availableSpaceEl.textContent = letter;
     }
   }
 
   function getTileColor(letter, index) {
     const isCorrectLetter = word.includes(letter);
 
     if (!isCorrectLetter) {
       return "rgb(58, 58, 60)";
     }
 
     const letterInThatPosition = word.charAt(index);
     const isCorrectPosition = letter === letterInThatPosition;
 
     if (isCorrectPosition) {
       return "rgb(83, 141, 78)";
     }
 
     return "rgb(181, 159, 59)";
   }

   function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 5) {
      window.alert("Word must be 5 letters");
    }
  
    const currentWord = currentWordArr.join("");
  
    // Fetch the word from the specified URL
    fetch('https://raw.githubusercontent.com/ShibuInu/abacadaba/main/js/words.txt')
      .then(response => response.text())
      .then(wordsText => {
        const wordsArray = wordsText.split('\n');
        const randomIndex = Math.floor(Math.random() * wordsArray.length);
        const actualWord = wordsArray[randomIndex].trim().toLowerCase();
  
        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index);
  
            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
          }, interval * index);
        });
  
        guessedWordCount += 1;
  
        if (currentWord === actualWord) {
          window.alert("Congratulations!");
        }
  
        if (guessedWords.length === 6) {
          window.alert(`Sorry, you have no more guesses! The word is ${actualWord}.`);
        }
  
        guessedWords.push([]);
      })
      .catch(() => {
        window.alert("Error fetching word or processing it!");
      });
  }
  
   
   function createSquares() {
     const gameBoard = document.getElementById("board");
 
     for (let index = 0; index < 30; index++) {
       let square = document.createElement("div");
       square.classList.add("square");
       square.classList.add("animate__animated");
       square.setAttribute("id", index + 1);
       gameBoard.appendChild(square);
     }
   }
 
   function handleDeleteLetter() {
     const currentWordArr = getCurrentWordArr();
     const removedLetter = currentWordArr.pop();
 
     guessedWords[guessedWords.length - 1] = currentWordArr;
 
     const lastLetterEl = document.getElementById(String(availableSpace - 1));
 
     lastLetterEl.textContent = "";
     availableSpace = availableSpace - 1;
   }
 
   for (let i = 0; i < keys.length; i++) {
     keys[i].onclick = ({ target }) => {
       const letter = target.getAttribute("data-key");
 
       if (letter === "enter") {
         handleSubmitWord();
         return;
       }
 
       if (letter === "del") {
         handleDeleteLetter();
         return;
       }
 
       updateGuessedWords(letter);
     };
   }
 });