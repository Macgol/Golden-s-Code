// ---------------- PASSAGES ----------------
const passage = {
  easy: ["My favorite day is Sunday. It is the day I enjoy the most. On this day I feel calm and free. I do not rush in the morning. I wake up slowly and feel happy. Sunday is special because there is no school or work. I can wear comfortable clothes. I eat breakfast without hurry. I enjoy the quiet time at home. This makes my mind feel peaceful.I like to spend Sunday with my family. We sit together and talk. Sometimes we watch movies or play simple games. We may go outside for fresh air. Being with family makes me feel safe and loved.On Sunday I also do things I like. I listen to music and read books. I rest and think about my goals. I prepare myself for the coming week.Sunday helps me relax and gain energy. It gives me happiness and comfort. That is why Sunday is my favorite day."],
  medium: ["Education plays an important role in our lives. It helps us gain knowledge, develop skills, and understand the world around us. Through education, people learn how to think clearly and make good decisions.Schools are places where students grow both mentally and socially. In classrooms, students learn subjects such as math, science, and language. They also learn how to communicate, work in teams, and respect others. These lessons help students become responsible members of society.Education also opens doors to better opportunities. With proper education, people can find good jobs and improve their quality of life. It gives individuals the confidence to face challenges and solve problems in creative ways.In addition, education helps society progress. Educated people contribute new ideas and solutions that help communities grow. For this reason, education is not only important for individuals, but also for the future of the world."],
  hard: ["On September 14 2024 at exactly 6 45 a.m. the city recorded its highest temperature of the year 41.7 degrees Celsius which shocked residents scientists and officials alike. According to Report No. 3.14 issued by the Climate Analysis Group Inc. this figure represented a 12.5 percent increase compared to the average recorded between 1990 and 2010 a period often described as the baseline era.The report stated that multiple factors contributed to this event including prolonged drought irregular wind patterns and excessive urban expansion especially in zones labeled A 1 B 3 and C 7. One expert Dr. Elena Morris PhD warned that if emissions are not reduced by at least 30 percent by 2030 the probability of similar events could rise to 78.9 percent or higher.Citizens responded with mixed reactions some called it a warning others dismissed it as coincidence. One resident stated This is not just weather it is a pattern while another replied Numbers can be misleading. Despite the debate one fact remains unchanged climate data when examined carefully tells a complex unsettling story filled with equations thresholds timelines and consequences that are increasingly difficult to ignore."]
}

// ---------------- STATE ----------------
let currentDifficulty = null,
    currentPassage = "",
    timerStarted = false,
    testEnded = false,
    timeLeft = 60,
    correctChars = 0,
    totalTypedChars = 0,
    currentIndex = 0,
    chars = []

const personalBest = { easy: null, medium: null, hard: null }
const savedBest = localStorage.getItem("typingPersonalBest")
if (savedBest) Object.assign(personalBest, JSON.parse(savedBest))

// ---------------- DOM ----------------
const personalBestDisplay = document.querySelector("#personalBest"),
      wpmDisplay = document.querySelector("#wpm"),
      accuracyDisplay = document.querySelector("#accuracy"),
      timerDisplay = document.querySelector("#timer"),
      textArea = document.querySelector("#textArea"),
      restart = document.querySelector("#restart"),
      difficultyContainer = document.querySelector(".difficulty"),
      userInput = document.getElementById("userInput")

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
let timeInterval = null

// ---------------- START TEST ----------------
difficultyContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("difficulty-btn")) return
  e.target.blur()
  startNewTest(e.target.dataset.level)
})

function startNewTest(level) {
  clearInterval(timeInterval)
  currentDifficulty = level
  currentPassage = passage[level][0]
  timerStarted = false
  testEnded = false
  timeLeft = 60
  correctChars = 0
  totalTypedChars = 0
  currentIndex = 0

  renderPassage()
  chars[0].classList.add("active")

  timerDisplay.textContent = timeLeft
  wpmDisplay.textContent = 0
  accuracyDisplay.textContent = "0%"
  personalBestDisplay.textContent =
    personalBest[level] ? `${personalBest[level]} WPM` : "-- WPM"

  if (isMobile) {
    userInput.value = ""
    userInput.focus()
  }
}

// ---------------- RENDER PASSAGE ----------------
function renderPassage() {
  textArea.innerHTML = ""
  for (const char of currentPassage) {
    const span = document.createElement("span")
    span.textContent = char
    textArea.appendChild(span)
  }
  chars = textArea.children
}

// ---------------- TIMER ----------------
function startTimer() {
  timeInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timeInterval)
      endTest()
      return
    }
    timeLeft--
    timerDisplay.textContent = timeLeft
  }, 1000)
}

// ---------------- ACCURACY ----------------
function updateAccuracy() {
  const accuracy = totalTypedChars === 0
    ? 0
    : Math.round((correctChars / totalTypedChars) * 100)
  accuracyDisplay.textContent = `${accuracy}%`
}

// ---------------- END TEST ----------------
function endTest() {
  if (testEnded) return
  testEnded = true
  clearInterval(timeInterval)

  const minutes = (60 - timeLeft) / 60
  const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0
  const accuracy = totalTypedChars === 0 ? 0 : Math.round((correctChars / totalTypedChars) * 100)

  let isNewBest = false
  if (personalBest[currentDifficulty] === null || wpm > personalBest[currentDifficulty]) {
    personalBest[currentDifficulty] = wpm
    localStorage.setItem("typingPersonalBest", JSON.stringify(personalBest))
    isNewBest = true
  }

  wpmDisplay.textContent = wpm
  accuracyDisplay.textContent = `${accuracy}%`
  personalBestDisplay.textContent = `${personalBest[currentDifficulty]} WPM`

  showResults(wpm, accuracy, isNewBest)
}

// ---------------- RESULTS ----------------
function showResults(wpm, accuracy, isNewBest) {
  textArea.innerHTML = `
    <div class="results">
      <h2>Test Complete 🎉</h2>
      <p><strong>WPM:</strong> ${wpm}</p>
      <p><strong>Accuracy:</strong> ${accuracy}%</p>
      <p><strong>Personal Best:</strong> ${personalBest[currentDifficulty]} WPM</p>
      ${isNewBest ? `<p class="congrats">🔥 New Personal Best!</p>` : ""}
    </div>
  `
}

// ---------------- TYPING LOGIC ----------------
function handleTypingKey(key) {
  if (!currentPassage || testEnded) return
  if (!timerStarted) {
    startTimer()
    timerStarted = true
  }

  // BACKSPACE
  if (key === "Backspace") {
    if (currentIndex === 0) return
    chars[currentIndex].classList.remove("active")
    currentIndex--
    if (chars[currentIndex].classList.contains("correct")) correctChars--
    totalTypedChars--
    chars[currentIndex].classList.remove("correct", "incorrect")
    chars[currentIndex].classList.add("active")
    updateAccuracy()
    return
  }

  // NORMAL CHAR
  if (key === chars[currentIndex].textContent) {
    chars[currentIndex].classList.add("correct")
    correctChars++
  } else {
    chars[currentIndex].classList.add("incorrect")
  }

  chars[currentIndex].classList.remove("active")
  totalTypedChars++
  updateAccuracy()
  currentIndex++

  if (currentIndex < chars.length) chars[currentIndex].classList.add("active")
  if (currentIndex >= chars.length) endTest()
}

// Desktop typing
if (!isMobile) {
  document.addEventListener("keydown", (e) => {
    if (e.key.length === 1 || e.key === "Backspace") handleTypingKey(e.key)
    if (e.key === " ") e.preventDefault()
  })
}

// Mobile typing
if (isMobile) {
  userInput.addEventListener("input", (e) => {
    const value = e.target.value
    const lastChar = value.slice(-1)
    handleTypingKey(lastChar)
    userInput.value = "" // clear input for next character
  })
}

// ---------------- RESTART ----------------
restart.addEventListener("click", () => {
  clearInterval(timeInterval)
  testEnded = false
  currentPassage = ""
  currentDifficulty = null

  textArea.innerHTML = `
    <h2>Ready?</h2>
    <p>Select a difficulty to begin</p>
  `
  timerDisplay.textContent = 60
  wpmDisplay.textContent = 0
  accuracyDisplay.textContent = "0%"
  if (isMobile) userInput.value = ""
})
