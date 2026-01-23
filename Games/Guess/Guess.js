const hometitle = document.getElementById('hometitle');
const attemptsElement = document.getElementById('attempts');
const WORD_LIST = [
    'APPLE', 'BEACH', 'CHINA', 'DANCE', 'EARTH', 'FIGHT', 'GHOST', 'HOUSE',
    'INPUT', 'JUICE', 'KNIFE', 'LEMON', 'MONEY', 'NIGHT', 'OCEAN', 'PIANO',
    'QUEEN', 'RIVER', 'STONE', 'TOWER', 'UNCLE', 'VOICE', 'WATER', 'YOUTH',
    'BRAVE', 'CLEAR', 'DRIVE', 'FIELD', 'GRAND', 'HEART', 'LIGHT', 'MOUNT',
    'PAINT', 'QUICK', 'ROUND', 'SMART', 'TRACK', 'WORLD', 'BREAK', 'CLOUD',
    'DREAM', 'FLAME', 'GRAPE', 'HAPPY', 'JUDGE', 'LAUGH', 'MUSIC', 'POWER',
    'RADIO', 'SHARK', 'TRAIN', 'WASTE', 'BEACH', 'CREAM', 'FLASH', 'GRAPE',
    'HAVEN', 'JOINT', 'MAGIC', 'NORTH', 'PEACE', 'QUEST', 'STORM', 'THINK'
];

let gameMode = '';
let targetNumber = 0;
let attempts = 0;
let guesses = [];
let targetWord = '';
let currentRow = 0;
let currentGuess = '';
let gameOver = false;
let keyboardState = {};

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'guessthenumber') {
        gameMode = 'number';
        hometitle.textContent = 'Guess The Number';
        document.getElementById('numberGame').style.display = 'flex';
        initNumberGame();
    } else {
        gameMode = 'wordle';
        hometitle.textContent = 'Guess The Word';
        document.getElementById('wordleGame').style.display = 'flex';
        initWordleGame();
    }
};


function initNumberGame() {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    guesses = [];
    attemptsElement.textContent = attempts;
    document.getElementById('numberFeedback').textContent = 'Guess a number between 1 and 100!';
    document.getElementById('guessHistory').innerHTML = '';
    document.getElementById('numberInput').value = '';
    document.getElementById('numberInput').focus();
}

function guessNumber() {
    const input = document.getElementById('numberInput');
    const guess = parseInt(input.value);
    const feedback = document.getElementById('numberFeedback');
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
        feedback.textContent = 'Please enter a valid number between 1 and 100!';
        return;
    }
    
    attempts++;
    attemptsElement.textContent = attempts;
    guesses.push(guess);
    
    updateGuessHistory();
    
    if (guess === targetNumber) {
        feedback.textContent = `🎉 CORRECT! You won in ${attempts} attempts! 🎉`;
        feedback.style.color = '#00ff00';
        input.disabled = true;
    } else if (guess < targetNumber) {
        feedback.textContent = '⬆️ TOO LOW! Try higher...';
        feedback.style.color = '#FFE66D';
    } else {
        feedback.textContent = '⬇️ TOO HIGH! Try lower...';
        feedback.style.color = '#FFE66D';
    }
    
    input.value = '';
    input.focus();
}

function updateGuessHistory() {
    const history = document.getElementById('guessHistory');
    history.innerHTML = '';
    
    guesses.forEach(guess => {
        const item = document.createElement('div');
        item.className = 'guess-item';
        item.textContent = guess;
        
        if (guess === targetNumber) {
            item.style.backgroundColor = '#00ff00';
            item.style.color = '#000';
        } else if (guess < targetNumber) {
            item.style.borderColor = '#ff6b6b';
        } else {
            item.style.borderColor = '#4ecdc4';
        }
        
        history.appendChild(item);
    });
}

function resetNumberGame() {
    document.getElementById('numberInput').disabled = false;
    document.getElementById('numberFeedback').style.color = '#FFE66D';
    initNumberGame();
}

document.getElementById('numberInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        guessNumber();
    }
});

function initWordleGame() {
    targetWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    currentRow = 0;
    currentGuess = '';
    attempts = 0;
    gameOver = false;
    keyboardState = {};
    attemptsElement.textContent = attempts;
    
    createWordGrid();
    createKeyboard();
    
    document.getElementById('wordleFeedback').textContent = 'Guess the 5-letter word!';
    document.getElementById('wordleFeedback').style.color = '#FFE66D';
}

function createWordGrid() {
    const grid = document.getElementById('wordGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'word-row';
        row.id = `row-${i}`;
        
        for (let j = 0; j < 5; j++) {
            const box = document.createElement('div');
            box.className = 'letter-box';
            box.id = `box-${i}-${j}`;
            row.appendChild(box);
        }
        
        grid.appendChild(row);
    }
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
    ];
    
    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        
        row.forEach(key => {
            const keyButton = document.createElement('button');
            keyButton.className = key.length > 1 ? 'key wide' : 'key';
            keyButton.textContent = key;
            keyButton.onclick = () => handleKeyPress(key);
            keyButton.id = `key-${key}`;
            rowDiv.appendChild(keyButton);
        });
        
        keyboard.appendChild(rowDiv);
    });
}

function handleKeyPress(key) {
    if (gameOver) return;
    
    if (key === 'ENTER') {
        submitGuess();
    } else if (key === 'BACK') {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateCurrentRow();
        }
    } else if (currentGuess.length < 5) {
        currentGuess += key;
        updateCurrentRow();
    }
}

function updateCurrentRow() {
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box-${currentRow}-${i}`);
        box.textContent = currentGuess[i] || '';
        box.className = currentGuess[i] ? 'letter-box active' : 'letter-box';
    }
}

function submitGuess() {
    if (currentGuess.length !== 5) {
        document.getElementById('wordleFeedback').textContent = 'Word must be 5 letters!';
        return;
    }
    
    attempts++;
    attemptsElement.textContent = attempts;
    
    
    const result = checkGuess(currentGuess, targetWord);
    
    
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box-${currentRow}-${i}`);
        box.className = `letter-box ${result[i]}`;
        
        
        const letter = currentGuess[i];
        if (!keyboardState[letter] || result[i] === 'correct') {
            keyboardState[letter] = result[i];
            const keyElement = document.getElementById(`key-${letter}`);
            if (keyElement) {
                keyElement.className = `key ${result[i]}`;
            }
        }
    }
    
    
    if (currentGuess === targetWord) {
        gameOver = true;
        document.getElementById('wordleFeedback').textContent = `🎉 YOU WON! The word was ${targetWord}! 🎉`;
        document.getElementById('wordleFeedback').style.color = '#00ff00';
        return;
    }
    
    currentRow++;
    currentGuess = '';
    
    
    if (currentRow >= 6) {
        gameOver = true;
        document.getElementById('wordleFeedback').textContent = `😞 GAME OVER! The word was ${targetWord}`;
        document.getElementById('wordleFeedback').style.color = '#ff6b6b';
        return;
    }
    
    document.getElementById('wordleFeedback').textContent = `Attempt ${currentRow + 1} of 6`;
}

function checkGuess(guess, target) {
    const result = Array(5).fill('absent');
    const targetLetters = target.split('');
    const guessLetters = guess.split('');
    
    
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            result[i] = 'correct';
            targetLetters[i] = null;
            guessLetters[i] = null;
        }
    }
    
    
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] !== null) {
            const index = targetLetters.indexOf(guessLetters[i]);
            if (index !== -1) {
                result[i] = 'present';
                targetLetters[index] = null;
            }
        }
    }
    
    return result;
}

function resetWordleGame() {
    initWordleGame();
}


document.addEventListener('keydown', function(e) {
    if (gameMode !== 'wordle' || gameOver) return;
    
    if (e.key === 'Enter') {
        handleKeyPress('ENTER');
    } else if (e.key === 'Backspace') {
        handleKeyPress('BACK');
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
    }
});