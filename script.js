const timerOptions = document.getElementsByName("timer-option");
const startBtn = document.getElementById("start-btn");
const nxtBtn = document.querySelector(".nextBtn");
const prevBtn = document.querySelector(".prevBtn");
const question = document.querySelector(".question");
const options = document.querySelector(".options");
const displayTimer = document.querySelector(".timer");
const quizSection = document.querySelector(".quiz");
const quizResult = document.querySelector('.result-panel');
let questionIndex;
let score = 0;
const questions = [];
const selectedAns = [];
let countdownInterval;

// API REQUEST
const apiUrl = "https://www.otriviata.com/api.php?amount=10";

async function getQuestions() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const results = data.results;
    return results;
  } catch (err) {
    console.error(err);
  }
}

async function selectQuestions() {
  const arr = await getQuestions();
  arr.forEach((element) => {
    const answers = [element.correct_answer, ...element.incorrect_answers].sort(
      () => Math.random() - 0.5
    );
    const questionParams = {
      answers: answers,
      question: element.question,
      correctAns: element.correct_answer,
    };
    questions.push(questionParams);
  });
}

selectQuestions();

// STARTS QUIZ ON CLICK
startBtn.addEventListener("click", () => {
  questionIndex = 0;
  document.querySelector(".start-panel").style.display = "none";
  displayQuiz(quizSection, "active");
  renderQuiz(questionIndex);
});

// GENERATES & RENDERS QUESTIONS & OPTIONS
function renderQuiz(index) {
  const currentQuestion = questions[index];
  question.innerText = currentQuestion.question;
  options.innerHTML = "";
  currentQuestion.answers.forEach((answer) => {
    const ans = document.createElement("button");
    ans.textContent = answer;
    options.appendChild(ans);
    ans.addEventListener("click", () => {
      selectedAns[questionIndex] = answer;
      if (selectedAns[questionIndex] === currentQuestion.correctAns) {
        score++;
      }
      // Remove the active class from all buttons and set selected option to red
      const allButtons = options.querySelectorAll('button');
      allButtons.forEach((button) => {
        button.classList.remove('select');
      });
      ans.classList.add('select');
    });
  });
}

nxtBtn.addEventListener("click", () => {
  if (questions.length === 0) {
    return console.log("Questions loading...");
  }
  if (questionIndex >= questions.length - 1) {
    showScore()
  }
  questionIndex++;
  renderQuiz(questionIndex);
});

prevBtn.addEventListener("click", () => {
  if (questionIndex === 0) {
    return console.log("First question");
  }
  questionIndex--;
  renderQuiz(questionIndex);
});

function startCountdown(count) {
  let timer = count;
  countdownInterval = setInterval(() => {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    displayTimer.textContent = `${minutes}:${seconds}`;

    if (--timer < 0) {
      clearInterval(countdownInterval);
      showScore();
    }
  }, 1000);
}

// LISTENS FOR TIMER SELECTION
for (const option of timerOptions) {
  option.addEventListener("change", () => {
    startBtn.disabled = false;
    if (option.value == "on") {
      startCountdown(900);
    } else if (option.value == "off") {
      clearInterval(countdownInterval);
    }
  });
}

function displayQuiz(element, className) {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}

// ENDS QUIZ SHOWS FINAL RESULTS
function showScore() {
  displayQuiz(quizSection, "active");
  displayQuiz(quizResult, "active");
  const scoreElement = document.createElement("p");
  scoreElement.textContent = `Your score: ${score} out of ${questions.length}`;
  quizResult.appendChild(scoreElement);
  clearInterval(countdownInterval);
}