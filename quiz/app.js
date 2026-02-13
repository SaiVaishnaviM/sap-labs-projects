// Quiz Questions Array
const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correct: 3
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Jane Austen", "William Shakespeare", "Charles Dickens", "Mark Twain"],
    correct: 1
  },
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correct: 2
  },
  {
    question: "Which country is home to the Eiffel Tower?",
    options: ["Germany", "Italy", "France", "Spain"],
    correct: 2
  },
  {
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Au", "Gd", "Ag"],
    correct: 1
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correct: 2
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correct: 1
  },
  {
    question: "In what year did the Titanic sink?",
    options: ["1910", "1912", "1915", "1920"],
    correct: 1
  }
];

// State
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;

// DOM Elements
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const questionCount = document.getElementById('questionCount');
const scoreDisplay = document.getElementById('scoreDisplay');
const percentageDisplay = document.getElementById('percentageDisplay');
const gradeDisplay = document.getElementById('gradeDisplay');
const feedbackBox = document.getElementById('feedbackBox');
const restartBtn = document.getElementById('restartBtn');

// Load Question
function loadQuestion() {
  const q = questions[currentQuestion];
  questionText.textContent = q.question;
  optionsContainer.innerHTML = '';
  selectedAnswer = null;
  answered = false;
  nextBtn.disabled = true;

  // Loop through options and create buttons
  for (let i = 0; i < q.options.length; i++) {
    const btn = document.createElement('button');
    btn.textContent = q.options[i];
    btn.className = 'option';
    btn.dataset.index = i;
    btn.addEventListener('click', () => selectOption(i));
    optionsContainer.appendChild(btn);
  }

  // Update progress
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressFill.style.width = progress + '%';
  questionCount.textContent = (currentQuestion + 1) + ' / ' + questions.length;
}

// Select Option
function selectOption(index) {
  if (answered) return;

  selectedAnswer = index;
  answered = true;

  // Get all option buttons
  const optionBtns = optionsContainer.querySelectorAll('.option');
  const correct = questions[currentQuestion].correct;

  // Loop through and mark answers
  for (let i = 0; i < optionBtns.length; i++) {
    optionBtns[i].disabled = true;
    if (i === correct) {
      optionBtns[i].classList.add('correct');
    } else if (i === selectedAnswer && selectedAnswer !== correct) {
      optionBtns[i].classList.add('incorrect');
    }
  }

  // Update score
  if (selectedAnswer === correct) {
    score++;
  }

  nextBtn.disabled = false;
}

// Next Question
nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

// Calculate Grade using if-else
function calculateGrade(percentage) {
  if (percentage >= 90) return 'A+';
  else if (percentage >= 80) return 'A';
  else if (percentage >= 70) return 'B';
  else if (percentage >= 60) return 'C';
  else if (percentage >= 50) return 'D';
  else return 'F';
}

// Get Feedback
function getFeedback(percentage) {
  if (percentage >= 90) {
    return "🌟 Outstanding! You have excellent knowledge. Keep up the great work!";
  } else if (percentage >= 80) {
    return "✨ Great job! You performed very well on this quiz.";
  } else if (percentage >= 70) {
    return "👍 Good effort! You have a solid understanding of the material.";
  } else if (percentage >= 60) {
    return "📚 Not bad! Review the weak areas and try again soon.";
  } else if (percentage >= 50) {
    return "💪 Keep studying! You're getting there. Practice makes perfect.";
  } else {
    return "📖 You need more preparation. Review the material and retake the quiz.";
  }
}

// Show Results
function showResults() {
  quizScreen.classList.remove('active');
  resultsScreen.classList.add('active');

  const percentage = (score / questions.length) * 100;
  const grade = calculateGrade(percentage);
  const feedback = getFeedback(percentage);

  scoreDisplay.textContent = score + ' / ' + questions.length;
  percentageDisplay.textContent = percentage.toFixed(1) + '%';
  gradeDisplay.textContent = grade;
  feedbackBox.textContent = feedback;

  // Color grade based on percentage
  if (percentage >= 80) {
    gradeDisplay.style.color = '#4ade80';
  } else if (percentage >= 60) {
    gradeDisplay.style.color = '#fbbf24';
  } else {
    gradeDisplay.style.color = '#ff6b6b';
  }
}

// Restart Quiz
restartBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  answered = false;

  resultsScreen.classList.remove('active');
  quizScreen.classList.add('active');

  loadQuestion();
});

// Initialize
loadQuestion();
