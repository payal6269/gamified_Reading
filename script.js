let score = 0;
let storyIndex = 0;
let puzzleIndex = 0;
let articles = [];
let allPuzzles = [];
let quizIndex = 0;
let quizScore = 0;

// 🎵 Load sound effects
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const completeSound = document.getElementById("completeSound");

// 🚀 Load stories
async function loadArticles() {
  const response = await fetch("articles.json");
  if (!response.ok) {
    alert("❌ Could not load articles.json!");
    return;
  }
  articles = await response.json();
  prepareAllPuzzles();
  showStory();
}

// 🔀 Combine all puzzles
function prepareAllPuzzles() {
  allPuzzles = [];
  for (const story of articles) {
    for (const p of story.puzzles) {
      allPuzzles.push({
        question: p.question,
        answer: p.answer,
        story: story.title
      });
    }
  }
  allPuzzles.sort(() => Math.random() - 0.5);
}

// ✨ Show each story
function showStory() {
  const articleBox = document.getElementById("article");
  const quizSection = document.getElementById("quiz-section");
  const quizButton = document.getElementById("start-quiz");

  quizSection.style.display = "none";
  quizButton.style.display = "none";

  if (storyIndex < articles.length) {
    const art = articles[storyIndex];
    const puzzle = art.puzzles[puzzleIndex];

    articleBox.innerHTML = `
      <h2 class="animate-pop">${art.title}</h2>
      <p class="fade-in">${art.content}</p>
      <div class="quiz-box">
        <p><strong>🧩 Question ${puzzleIndex + 1} of ${art.puzzles.length}:</strong> ${puzzle.question}</p>
        <input id="userAnswer" type="text" placeholder="Type your answer..." />
        <button onclick="checkAnswer()">Submit</button>
      </div>
      <p id="score">Score: ${score}</p>
    `;
  } else {
    completeSound.play();
    articleBox.innerHTML = `
      <h2>🎉 All Stories Completed!</h2>
      <p>Your Final Score: ${score}</p>
      <button onclick="startCombinedQuiz()">🧠 Take Combined Quiz</button>
    `;
  }
}

// ✅ Check per-story puzzle answer
function checkAnswer() {
  const userInput = document.getElementById("userAnswer").value.trim().toLowerCase();
  const correct = articles[storyIndex].puzzles[puzzleIndex].answer.toLowerCase();

  if (userInput === correct) {
    correctSound.play();
    alert("✅ Correct! +10 points");
    score += 10;
  } else {
    wrongSound.play();
    alert(`❌ Wrong! Correct answer: ${correct}`);
  }

  puzzleIndex++;
  if (puzzleIndex >= articles[storyIndex].puzzles.length) {
    puzzleIndex = 0;
    storyIndex++;
  }
  showStory();
}

// 🧠 Combined quiz mode
function startCombinedQuiz() {
  document.getElementById("article").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";
  quizIndex = 0;
  quizScore = 0;
  showQuizQuestion();
}

function showQuizQuestion() {
  if (quizIndex < allPuzzles.length) {
    const q = allPuzzles[quizIndex];
    document.getElementById("quiz-question").innerHTML = `
      <p><strong>Story:</strong> ${q.story}</p>
      <p><strong>Q${quizIndex + 1}:</strong> ${q.question}</p>
    `;
    document.getElementById("quiz-answer").value = "";
    document.getElementById("quiz-score").innerText = `Score: ${quizScore}`;
  } else {
    completeSound.play();
    document.getElementById("quiz-section").innerHTML = `
      <h2>🏆 Combined Quiz Completed!</h2>
      <p>Your Final Quiz Score: ${quizScore}</p>
      <button onclick="restartGame()">Play Again</button>
    `;
  }
}

function checkQuizAnswer() {
  const userAnswer = document.getElementById("quiz-answer").value.trim().toLowerCase();
  const correct = allPuzzles[quizIndex].answer.toLowerCase();

  if (userAnswer === correct) {
    correctSound.play();
    alert("✅ Correct! +10 points");
    quizScore += 10;
  } else {
    wrongSound.play();
    alert(`❌ Wrong! Correct answer: ${correct}`);
  }

  quizIndex++;
  showQuizQuestion();
}

function restartGame() {
  location.reload();
}

loadArticles();
