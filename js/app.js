const TIMES_TABLES_SKILL = 'times-tables';
const practiceSkills = window.practiceSkills;
const { shuffle, randomInt } = window.SkillUtils;

function getMasteryKey(a, b) {
    return a <= b ? `${a}x${b}` : `${b}x${a}`;
}


function saveProgress() {
    localStorage.setItem('timesTablesMastery', JSON.stringify(mastery));
    localStorage.setItem('timesTablesTieredMode', JSON.stringify(tieredMode));
    localStorage.setItem('skillMastery', JSON.stringify(skillMastery));
}

function loadProgress() {
    const savedMastery = localStorage.getItem('timesTablesMastery');
    const savedMode = localStorage.getItem('timesTablesTieredMode');
    const savedSkillMastery = localStorage.getItem('skillMastery');

    if (savedMastery) Object.assign(mastery, JSON.parse(savedMastery));
    if (savedSkillMastery) Object.assign(skillMastery, JSON.parse(savedSkillMastery));
    if (savedMode !== null) {
        tieredMode = JSON.parse(savedMode);
        modeToggle.checked = tieredMode;
    }
}

function resetProgress() {
    const confirmed = confirm('Are you sure you want to reset progress for this page? This cannot be undone.');
    if (!confirmed) return;

    if (activeSkillId === TIMES_TABLES_SKILL) {
        for (let key in mastery) mastery[key] = 0;
        localStorage.removeItem('timesTablesMastery');
        localStorage.removeItem('timesTablesTieredMode');
        updateProgressGrid();
    } else {
        skillMastery[activeSkillId] = 0;
        saveProgress();
        updateSkillMasteryDisplay();
    }

    statusEl.textContent = '';
    statusEl.className = 'status-message';
    questionEl.textContent = activeSkillId === TIMES_TABLES_SKILL ? 'Click "Next Question" to start!' : 'Click "Next Question" to start this skill!';
    answersEl.innerHTML = '';
}

const mastery = {};
for (let i = 1; i <= 12; i++) {
    for (let j = i; j <= 12; j++) mastery[getMasteryKey(i, j)] = 0;
}

const skillMastery = {};
practiceSkills.forEach(skill => skillMastery[skill.id] = 0);

const tiers = [[1, 2, 10], [5, 4], [3, 6], [9, 8], [7, 11, 12]];

let currentQuestion = null;
let currentAnswer = null;
let timerInterval = null;
let timeRemaining = 7000;
let answered = false;
let tieredMode = true;
let activeSkillId = TIMES_TABLES_SKILL;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const timerBar = document.getElementById('timerBar');
const timerContainer = document.getElementById('timerContainer');
const statusEl = document.getElementById('status');
const nextBtn = document.getElementById('nextBtn');
const progressGrid = document.getElementById('progressGrid');
const progressTitle = document.getElementById('progressTitle');
const modeToggle = document.getElementById('modeToggle');
const modeToggleRow = document.getElementById('modeToggleRow');
const resetBtn = document.getElementById('resetBtn');
const skillsBtn = document.getElementById('skillsBtn');
const backToTimesBtn = document.getElementById('backToTimesBtn');
const selectionScreen = document.getElementById('selectionScreen');
const gameScreen = document.getElementById('gameScreen');
const skillList = document.getElementById('skillList');
const pageTitle = document.getElementById('pageTitle');
const contentWrapper = document.getElementById('contentWrapper');
const skillMasteryDisplay = document.getElementById('skillMasteryDisplay');
const skillMasteryPercent = document.getElementById('skillMasteryPercent');
const skillMasteryBar = document.getElementById('skillMasteryBar');
const masterySmiley = document.getElementById('masterySmiley');

function getUnlockedNumbers() {
    if (!tieredMode) return [1,2,3,4,5,6,7,8,9,10,11,12];
    const unlockedNumbers = new Set();
    for (let tierIndex = 0; tierIndex < tiers.length; tierIndex++) {
        const tierNumbers = tiers[tierIndex];
        if (tierIndex > 0) {
            let allPreviousMastered = true;
            const previousNumbers = new Set();
            for (let i = 0; i < tierIndex; i++) tiers[i].forEach(num => previousNumbers.add(num));
            for (let i = 1; i <= 12; i++) {
                for (let j = 1; j <= 12; j++) {
                    if (previousNumbers.has(i) || previousNumbers.has(j)) {
                        if (mastery[getMasteryKey(i, j)] < 5) allPreviousMastered = false;
                    }
                }
            }
            if (!allPreviousMastered) break;
        }
        tierNumbers.forEach(num => unlockedNumbers.add(num));
    }
    return Array.from(unlockedNumbers);
}

function isQuestionUnlocked(a, b) {
    return !tieredMode || getUnlockedNumbers().includes(a) || getUnlockedNumbers().includes(b);
}

function initProgressGrid() {
    progressGrid.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= 12; j++) {
            const cell = document.createElement('div');
            cell.className = 'progress-cell';
            cell.textContent = `${i}×${j}`;
            cell.id = `cell-${i}x${j}`;
            progressGrid.appendChild(cell);
        }
    }
    updateProgressGrid();
}

function updateProgressGrid() {
    for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= 12; j++) {
            const cell = document.getElementById(`cell-${i}x${j}`);
            const masteryLevel = mastery[getMasteryKey(i, j)];
            if (!isQuestionUnlocked(i, j)) {
                cell.classList.add('locked');
            } else {
                cell.classList.remove('locked');
                const ratio = masteryLevel / 5;
                const r = Math.round(255 * (1 - ratio) + 34 * ratio);
                const g = Math.round(255 * (1 - ratio) + 197 * ratio);
                const b = Math.round(255 * (1 - ratio) + 94 * ratio);
                cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            }
        }
    }
}

function getWeight(masteryLevel) {
    return 1 - (masteryLevel / 5) * 0.99;
}

function selectWeightedQuestion() {
    const questions = [];
    const weights = [];
    for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= 12; j++) {
            if (!isQuestionUnlocked(i, j)) continue;
            const key = getMasteryKey(i, j);
            questions.push({ a: i, b: j, key });
            weights.push(getWeight(mastery[key]));
        }
    }
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < questions.length; i++) {
        random -= weights[i];
        if (random <= 0) return questions[i];
    }
    return questions[questions.length - 1];
}

function generateWrongAnswers(correct) {
    const wrong = new Set();
    while (wrong.size < 5) {
        const strategy = Math.floor(Math.random() * 4);
        let wrongAnswer;
        switch(strategy) {
            case 0: wrongAnswer = correct + (Math.random() < 0.5 ? 1 : -1) * randomInt(1, 5); break;
            case 1: wrongAnswer = currentQuestion.a + currentQuestion.b; break;
            case 2: wrongAnswer = (currentQuestion.a + (Math.random() < 0.5 ? 1 : -1)) * currentQuestion.b; break;
            default: wrongAnswer = randomInt(1, 144);
        }
        if (wrongAnswer !== correct && wrongAnswer > 0 && wrongAnswer <= 144) wrong.add(wrongAnswer);
    }
    return Array.from(wrong);
}


function startTimer() {
    timeRemaining = 7000;
    const startTime = Date.now();
    const totalTime = 7000;
    timerBar.style.width = '100%';
    timerBar.classList.remove('urgent');
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timeRemaining = totalTime - elapsed;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerBar.style.width = '0%';
            if (!answered) handleTimeout();
        } else {
            timerBar.style.width = ((timeRemaining / totalTime) * 100) + '%';
            if (timeRemaining <= 2000) timerBar.classList.add('urgent');
        }
    }, 50);
}

function handleAnswer(selectedAnswer, button) {
    if (answered) return;
    answered = true;
    clearInterval(timerInterval);
    const allButtons = answersEl.querySelectorAll('.answer-btn');
    allButtons.forEach(btn => btn.disabled = true);
    const isCorrect = selectedAnswer === currentAnswer;
    if (isCorrect) {
        button.classList.add('correct');
        statusEl.textContent = '✓ Correct!';
        statusEl.className = 'status-message correct';
        if (activeSkillId === TIMES_TABLES_SKILL) {
            if (mastery[currentQuestion.key] < 5) mastery[currentQuestion.key]++;
        } else {
            const previousMastery = skillMastery[activeSkillId] || 0;
            skillMastery[activeSkillId] = Math.min(100, skillMastery[activeSkillId] + 7);
            if (previousMastery < 100 && skillMastery[activeSkillId] >= 100) {
                statusEl.textContent = '✓ Mastered! Returning to skills...';
                showMasterySmiley();
                setTimeout(showSkillSelection, 2000);
            }
        }
    } else {
        button.classList.add('incorrect');
        statusEl.textContent = `✗ Wrong! The answer is ${currentAnswer}`;
        statusEl.className = 'status-message incorrect';
        if (activeSkillId === TIMES_TABLES_SKILL) {
            if (mastery[currentQuestion.key] > 0) mastery[currentQuestion.key]--;
        } else {
            skillMastery[activeSkillId] = Math.max(0, skillMastery[activeSkillId] - 11);
        }
        allButtons.forEach(btn => {
            if (btn.textContent === currentAnswer) btn.classList.add('correct');
        });
    }
    saveProgress();
    if (activeSkillId === TIMES_TABLES_SKILL) updateProgressGrid(); else updateSkillMasteryDisplay();
}

function showMasterySmiley() {
    masterySmiley.classList.remove('hidden');
    masterySmiley.style.animation = 'none';
    masterySmiley.offsetHeight;
    masterySmiley.style.animation = '';
    setTimeout(() => {
        masterySmiley.classList.add('hidden');
    }, 2000);
}

function handleTimeout() {
    answered = true;
    const allButtons = answersEl.querySelectorAll('.answer-btn');
    allButtons.forEach(btn => btn.disabled = true);
    statusEl.textContent = `⏱ Time's up! The answer is ${currentAnswer}`;
    statusEl.className = 'status-message incorrect';
    if (activeSkillId === TIMES_TABLES_SKILL) {
        if (mastery[currentQuestion.key] > 0) mastery[currentQuestion.key]--;
    } else {
        skillMastery[activeSkillId] = Math.max(0, skillMastery[activeSkillId] - 11);
    }
    allButtons.forEach(btn => {
        if (btn.textContent === currentAnswer) btn.classList.add('correct');
    });
    saveProgress();
    if (activeSkillId === TIMES_TABLES_SKILL) updateProgressGrid(); else updateSkillMasteryDisplay();
}

function nextQuestion() {
    answered = false;
    statusEl.textContent = '';
    statusEl.className = 'status-message';
    if (activeSkillId === TIMES_TABLES_SKILL) {
        currentQuestion = selectWeightedQuestion();
        currentAnswer = (currentQuestion.a * currentQuestion.b).toString();
        questionEl.textContent = `${currentQuestion.a} × ${currentQuestion.b} = ?`;
        const allAnswers = shuffle([...generateWrongAnswers(Number(currentAnswer)).map(String), currentAnswer]);
        renderAnswers(allAnswers);
        startTimer();
    } else {
        const skill = practiceSkills.find(item => item.id === activeSkillId);
        currentQuestion = skill.generateQuestion();
        currentAnswer = currentQuestion.correctAnswer;
        questionEl.textContent = currentQuestion.prompt;
        renderAnswers(currentQuestion.answers);
    }
}

function renderAnswers(allAnswers) {
    answersEl.innerHTML = '';
    allAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => handleAnswer(answer, button);
        answersEl.appendChild(button);
    });
}

function updateSkillMasteryDisplay() {
    const percent = skillMastery[activeSkillId] || 0;
    skillMasteryPercent.textContent = `${percent}%`;
    skillMasteryBar.style.width = `${percent}%`;
}

function showSkillSelection() {
    clearInterval(timerInterval);
    selectionScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    skillsBtn.classList.add('hidden');
    backToTimesBtn.classList.remove('hidden');
    pageTitle.textContent = 'Skills';
    activeSkillId = null;
    renderSkillList();
}

function showTimesTables() {
    activeSkillId = TIMES_TABLES_SKILL;
    selectionScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    skillsBtn.classList.remove('hidden');
    backToTimesBtn.classList.add('hidden');
    pageTitle.textContent = 'Times Tables Master';
    modeToggleRow.classList.remove('hidden');
    timerContainer.classList.remove('hidden');
    progressGrid.classList.remove('hidden');
    skillMasteryDisplay.classList.add('hidden');
    contentWrapper.classList.remove('skill-mode');
    progressTitle.textContent = 'Your Progress (12×12 Times Tables)';
    resetBtn.textContent = 'Reset All Progress';
    questionEl.textContent = 'Click "Next Question" to start!';
    statusEl.textContent = '';
    answersEl.innerHTML = '';
    updateProgressGrid();
}

function startSkill(skillId) {
    activeSkillId = skillId;
    const skill = practiceSkills.find(item => item.id === skillId);
    selectionScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    skillsBtn.classList.remove('hidden');
    backToTimesBtn.classList.remove('hidden');
    pageTitle.textContent = skill.name;
    modeToggleRow.classList.add('hidden');
    timerContainer.classList.add('hidden');
    progressGrid.classList.add('hidden');
    skillMasteryDisplay.classList.remove('hidden');
    contentWrapper.classList.add('skill-mode');
    progressTitle.textContent = `${skill.name} Mastery`;
    resetBtn.textContent = 'Reset This Skill';
    questionEl.textContent = 'Click "Next Question" to start this skill!';
    statusEl.textContent = '';
    answersEl.innerHTML = '';
    updateSkillMasteryDisplay();
}

function renderSkillList() {
    skillList.innerHTML = '';
    practiceSkills.forEach(skill => {
        const card = document.createElement('button');
        card.className = 'skill-card';
        card.innerHTML = `<h2>${skill.name}</h2><p>${skill.description}</p><p><strong>${skillMastery[skill.id] || 0}% mastered</strong></p>`;
        card.onclick = () => startSkill(skill.id);
        skillList.appendChild(card);
    });
}


nextBtn.addEventListener('click', nextQuestion);
modeToggle.addEventListener('change', function() {
    tieredMode = this.checked;
    saveProgress();
    updateProgressGrid();
});
resetBtn.addEventListener('click', resetProgress);
skillsBtn.addEventListener('click', showSkillSelection);
backToTimesBtn.addEventListener('click', showTimesTables);

loadProgress();
initProgressGrid();
renderSkillList();
