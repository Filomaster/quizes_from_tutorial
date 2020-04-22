const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const progressBar = document.getElementById("progressbar-fill");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availbleQuestions = [];

let MAX_QUESTIONS;

let questions = [];

// === questions from local json ===
// fetch("questions.json")
//   .then((res) => {
//     return res.json();
//   })
//   .then((loadedQuestions) => {
//     questions = loadedQuestions;
//     MAX_QUESTIONS = questions.length / 2;
//     startGame();
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// === question from open trivia ===
fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficultyeasy&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    MAX_QUESTIONS = 10;
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });
    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

const CORRECT_BONUS = 10;

startGame = () => {
  console.log("Started game");
  questionCounter = 0;
  score = 0;
  availbleQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availbleQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to end page
    return window.location.assign("/end.html");
  }
  questionCounter++;
  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
  //Update progress bar
  progressBar.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
  console.log((questionCounter / MAX_QUESTIONS) * 100);
  const questionIndex = Math.floor(Math.random() * availbleQuestions.length);
  currentQuestion = availbleQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerHTML = currentQuestion["choice" + number];
  });

  availbleQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    selectedChoice.parentElement.classList.add(classToApply);
    selectedChoice.parentElement.classList.add("pressed");
    setTimeout(() => {
      if (classToApply === "correct") {
        incrementScore(CORRECT_BONUS);
      }
      selectedChoice.parentElement.classList.remove(classToApply);
      selectedChoice.parentElement.classList.remove("pressed");
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
  console.log(`Score incremented with ${num} and now it's ${score} points`);
};
