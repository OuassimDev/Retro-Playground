let isHard = false;
let gameOver = false;
let modetext = document.getElementById("mode");
let cards = document.getElementById("cards");
let card21 = document.getElementById("21");
let card22 = document.getElementById("22");
let card23 = document.getElementById("23");
let card24 = document.getElementById("24");
let body = document.getElementById("body");

let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;


let timeRemaining = 90; 
let timerInterval = null;
let timerElement = null;

const easyEmojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎸', '🎹', '🎺'];
const hardEmojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎸', '🎹', '🎺', '🎻', '🎼'];

card21.style.display = "none";
card22.style.display = "none";
card23.style.display = "none";
card24.style.display = "none";

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'hard') {
        isHard = true;
        modetext.textContent = "Hard Mode";
        if (window.innerWidth <= 768) {
            cards.style.gridTemplateColumns = "repeat(4, 1fr)";
            modetext.style.fontSize = "1em";
        } else {
            cards.style.gridTemplateColumns = "repeat(6, 1fr)";
        }
        card21.style.display = "flex";
        card22.style.display = "flex";
        card23.style.display = "flex";
        card24.style.display = "flex";
      
        createTimerElement();
    }
    
    InitializeGame();
}

function InitializeGame() {
    const numPairs = isHard ? 12 : 10;
    const emojis = isHard ? hardEmojis : easyEmojis;
    
    let cardValues = [];
    for (let i = 0; i < numPairs; i++) {
        cardValues.push(emojis[i], emojis[i]);
    }
    cardValues = shuffleArray(cardValues);
    
    const cardElements = document.querySelectorAll('.cards div');
    cardElements.forEach((card, index) => {
        if (index < cardValues.length) {
            card.dataset.emoji = cardValues[index];
            card.textContent = '';
            card.classList.remove('flipped', 'matched');
            card.style.pointerEvents = 'auto';
            card.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)';
            
            card.onclick = function() {
                flipCard(card);
            };
        }
    });
    
    flippedCards = [];
    matchedPairs = 0;
    canFlip = true;
    gameOver = false;
    
    if (isHard) {
        startTimer();
    }
}

function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched') || gameOver) {
        return;
    }
    
    card.textContent = card.dataset.emoji;
    card.classList.add('flipped');
    card.style.background = 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)';
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        canFlip = false;
        
        setTimeout(() => {
            checkMatch();
        }, 800);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.style.background = 'linear-gradient(135deg, #90EE90 0%, #7CFC00 100%)';
        card2.style.background = 'linear-gradient(135deg, #90EE90 0%, #7CFC00 100%)';
        card1.style.pointerEvents = 'none';
        card2.style.pointerEvents = 'none';
        
        matchedPairs++;
        
        const totalPairs = isHard ? 12 : 10;
        if (matchedPairs === totalPairs) {
            setTimeout(() => {
                if (isHard) {
                    clearInterval(timerInterval);
                }
                modetext.textContent = "🎉 Congratulations! You won! 🎉";
                gameOver = true;
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.textContent = '';
            card2.textContent = '';
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)';
            card2.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)';
        }, 200);
    }
    
    flippedCards = [];
    canFlip = true;
}

function ResetGame() {
    if (isHard && timerInterval) {
        clearInterval(timerInterval);
    }
    timeRemaining = 90;
    if (isHard) {
        modetext.textContent = "Hard Mode";
    } else {
        modetext.textContent = "Easy Mode";
    }
    InitializeGame();
}

function createTimerElement() {
    timerElement = document.createElement('div');
    timerElement.id = 'timer';
    timerElement.style.cssText = `
        font-family: 'Press Start 2P', 'Courier New', monospace;
        font-size: 24px;
        color: #FFE66D;
        text-shadow: -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000;
        margin: 10px 0;
    `;
    
    
    const gamebox = document.querySelector('.gamebox');
    gamebox.insertBefore(timerElement, cards);
    
    updateTimerDisplay();
}

function updateTimerDisplay() {
    if (!timerElement) return;
    
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `⏰ ${minutes}:${seconds.toString().padStart(2, '0')}`;
    

    if (timeRemaining <= 30) {
        timerElement.style.color = '#FF6B6B';
        timerElement.style.animation = 'pulse 1s ease-in-out infinite';
    } else {
        timerElement.style.color = '#FFE66D';
        timerElement.style.animation = 'none';
    }
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timeRemaining = 90;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            gameOver = true;
            canFlip = false;
            
            
            const cardElements = document.querySelectorAll('.cards div');
            cardElements.forEach(card => {
                card.style.pointerEvents = 'none';
            });
            
            setTimeout(() => {
                modetext.textContent = "⏰ Time's Up! Game Over!";
            }, 500);
        }
    }, 1000);
}

window.addEventListener('resize', () => {
    if (isHard) {
        if (window.innerWidth <= 768) {
            cards.style.gridTemplateColumns = "repeat(4, 1fr)";
        } else {
            cards.style.gridTemplateColumns = "repeat(6, 1fr)";
        }
    }
});