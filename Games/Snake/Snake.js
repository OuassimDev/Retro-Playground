const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameTitle = document.getElementById('gameTitle');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const mobileControls = document.getElementById('mobileControls');
let nextDirection = null;


let isHard = false;
let gridSize = 20;
let tileCount = 20;
let tileSize;
let snake = [];
let food = {};
let obstacles = [];
let dx = 0;
let dy = 0;
let score = 0;
let highScore = 0;
let gameLoop = null;
let gameSpeed = 150;
let gameStarted = false;


window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'hard') {
        isHard = true;
        tileCount = 25; 
        gameSpeed = 100;
        gameTitle.textContent = 'Hard Mode';
    } else {
        gameTitle.textContent = 'Easy Mode';
    }
    
    setupCanvas();
    initGame();
};

function setupCanvas() {
    if (window.innerWidth <= 768) {
        canvas.width = Math.min(400, window.innerWidth - 40);
        canvas.height = canvas.width;
    } else {
        canvas.width = isHard ? 600 : 400;
        canvas.height = isHard ? 600 : 400;
    }
    
    tileSize = canvas.width / tileCount;
}

function initGame() {
    snake = [
        { x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }
    ];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    obstacles = [];
    
    generateFood();
    if (isHard) {
        generateObstacles(6);
    }
    
    drawGame();
}

function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    dx = 1;
    dy = 0;
    
    
    startBtn.style.display = 'none';
    
    
    if (window.innerWidth <= 768) {
        resetBtn.style.display = 'none';
        mobileControls.style.display = 'grid';
    }
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

function update() {
    if (nextDirection !== null) {
        if (nextDirection.dx !== 0 && dx === 0) {
            dx = nextDirection.dx;
            dy = 0;
        } else if (nextDirection.dy !== 0 && dy === 0) {
            dx = 0;
            dy = nextDirection.dy;
        }
        nextDirection = null;
    }
    
    moveSnake();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        scoreElement.textContent = score;
        
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
        }
        
        generateFood();

        if (isHard) {
            if (obstacles.length < 5) {
                // Initial obstacles
                generateObstacles(5 - obstacles.length);
            } else if (score % 5 === 0 && obstacles.length < 7) {
                replaceRandomObstacle();
            }
        }

    } else {
        snake.pop();
    }
    
    drawGame();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
}

function checkCollision() {
    const head = snake[0];
    
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
   
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
   
    if (isHard) {
        for (let obstacle of obstacles) {
            if (head.x === obstacle.x && head.y === obstacle.y) {
                return true;
            }
        }
    }
    
    return false;
}

function generateFood() {
    let validPosition = false;
    
    while (!validPosition) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        validPosition = true;
        
        
        for (let segment of snake) {
            if (food.x === segment.x && food.y === segment.y) {
                validPosition = false;
                break;
            }
        }
        
        
        if (isHard) {
            for (let obstacle of obstacles) {
                if (food.x === obstacle.x && food.y === obstacle.y) {
                    validPosition = false;
                    break;
                }
            }
        }
    }
}

function generateObstacles(count) {
    for (let i = 0; i < count; i++) {
        let validPosition = false;
        let obstacle;
        
        while (!validPosition) {
            obstacle = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            
            validPosition = true;
            
           
            for (let segment of snake) {
                if (obstacle.x === segment.x && obstacle.y === segment.y) {
                    validPosition = false;
                    break;
                }
            }
            
            
            if (obstacle.x === food.x && obstacle.y === food.y) {
                validPosition = false;
            }
            
            
            for (let obs of obstacles) {
                if (obstacle.x === obs.x && obstacle.y === obs.y) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        obstacles.push(obstacle);
    }
}

function replaceRandomObstacle() {
    if (obstacles.length === 0) return;
    
    
    const randomIndex = Math.floor(Math.random() * obstacles.length);
    obstacles.splice(randomIndex, 1);
    
    generateObstacles(1);
}

//ye drawing is completly ai :) :
function drawGame() {
    
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    
    ctx.strokeStyle = 'rgba(255, 230, 109, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tileSize, 0);
        ctx.lineTo(i * tileSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * tileSize);
        ctx.lineTo(canvas.width, i * tileSize);
        ctx.stroke();
    }
    

    snake.forEach((segment, index) => {
        if (index === 0) {
           
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(
                segment.x * tileSize + 2,
                segment.y * tileSize + 2,
                tileSize - 4,
                tileSize - 4
            );
            
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                segment.x * tileSize + 2,
                segment.y * tileSize + 2,
                tileSize - 4,
                tileSize - 4
            );
            
           
            ctx.fillStyle = '#fff';
            let eyeSize = tileSize / 6;
            let eyeOffset = tileSize / 4;
            
            if (dx === 1) { 
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset, segment.y * tileSize + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset, segment.y * tileSize + tileSize - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                
               
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset + 2, segment.y * tileSize + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset + 2, segment.y * tileSize + tileSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (dx === -1) { 
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + eyeOffset, segment.y * tileSize + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + eyeOffset, segment.y * tileSize + tileSize - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                
               
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + eyeOffset - 2, segment.y * tileSize + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + eyeOffset - 2, segment.y * tileSize + tileSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (dy === -1) { 
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + eyeOffset, segment.y * tileSize + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset, segment.y * tileSize + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
          
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + eyeOffset, segment.y * tileSize + eyeOffset - 2, eyeSize / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset, segment.y * tileSize + eyeOffset - 2, eyeSize / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (dy === 1) { 
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + eyeOffset, segment.y * tileSize + tileSize - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset, segment.y * tileSize + tileSize - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                
                
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + eyeOffset, segment.y * tileSize + tileSize - eyeOffset + 2, eyeSize / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset, segment.y * tileSize + tileSize - eyeOffset + 2, eyeSize / 2, 0, Math.PI * 2);
                ctx.fill();
            } else { 
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset, segment.y * tileSize + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset, segment.y * tileSize + tileSize - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                
              
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset, segment.y * tileSize + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * tileSize + tileSize - eyeOffset, segment.y * tileSize + tileSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
           
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            if (dx === 1) { 
                ctx.moveTo(segment.x * tileSize + tileSize, segment.y * tileSize + tileSize / 2);
                ctx.lineTo(segment.x * tileSize + tileSize + 6, segment.y * tileSize + tileSize / 2 - 3);
                ctx.moveTo(segment.x * tileSize + tileSize, segment.y * tileSize + tileSize / 2);
                ctx.lineTo(segment.x * tileSize + tileSize + 6, segment.y * tileSize + tileSize / 2 + 3);
            } else if (dx === -1) { 
                ctx.moveTo(segment.x * tileSize, segment.y * tileSize + tileSize / 2);
                ctx.lineTo(segment.x * tileSize - 6, segment.y * tileSize + tileSize / 2 - 3);
                ctx.moveTo(segment.x * tileSize, segment.y * tileSize + tileSize / 2);
                ctx.lineTo(segment.x * tileSize - 6, segment.y * tileSize + tileSize / 2 + 3);
            } else if (dy === -1) { 
                ctx.moveTo(segment.x * tileSize + tileSize / 2, segment.y * tileSize);
                ctx.lineTo(segment.x * tileSize + tileSize / 2 - 3, segment.y * tileSize - 6);
                ctx.moveTo(segment.x * tileSize + tileSize / 2, segment.y * tileSize);
                ctx.lineTo(segment.x * tileSize + tileSize / 2 + 3, segment.y * tileSize - 6);
            } else if (dy === 1) { 
                ctx.moveTo(segment.x * tileSize + tileSize / 2, segment.y * tileSize + tileSize);
                ctx.lineTo(segment.x * tileSize + tileSize / 2 - 3, segment.y * tileSize + tileSize + 6);
                ctx.moveTo(segment.x * tileSize + tileSize / 2, segment.y * tileSize + tileSize);
                ctx.lineTo(segment.x * tileSize + tileSize / 2 + 3, segment.y * tileSize + tileSize + 6);
            }
            ctx.stroke();
        } else {
            
            ctx.fillStyle = '#90EE90';
            ctx.fillRect(
                segment.x * tileSize + 2,
                segment.y * tileSize + 2,
                tileSize - 4,
                tileSize - 4
            );
            
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                segment.x * tileSize + 2,
                segment.y * tileSize + 2,
                tileSize - 4,
                tileSize - 4
            );
        }
    });
    
    
    ctx.fillStyle = '#22ff00ff';
    ctx.beginPath();
    ctx.arc(
        food.x * tileSize + tileSize / 2,
        food.y * tileSize + tileSize / 2,
        tileSize / 2 - 4,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
   
    if (isHard) {
        obstacles.forEach(obstacle => {
            ctx.fillStyle = '#ff4444';
            ctx.fillRect(
                obstacle.x * tileSize + 2,
                obstacle.y * tileSize + 2,
                tileSize - 4,
                tileSize - 4
            );
            
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                obstacle.x * tileSize + 2,
                obstacle.y * tileSize + 2,
                tileSize - 4,
                tileSize - 4
            );
        });
    }
}

function gameOver() {
    clearInterval(gameLoop);
    gameStarted = false;
    gameTitle.textContent = '💀 GAME OVER! 💀';
    

    if (window.innerWidth <= 768) {
        mobileControls.style.display = 'none';
        resetBtn.style.display = 'inline-block';
    }
    
    setTimeout(() => {
        gameTitle.textContent = isHard ? 'Hard Mode' : 'Easy Mode';
    }, 2000);
}

function resetGame() {
    if (gameLoop) clearInterval(gameLoop);
    gameStarted = false;

    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'inline-block';
    
    
    if (window.innerWidth <= 768) {
        mobileControls.style.display = 'none';
    }
    
    initGame();
    gameTitle.textContent = isHard ? 'Hard Mode' : 'Easy Mode';
}

function changeDirection(newDx, newDy) {
    if (!gameStarted) return;

    nextDirection = { dx: newDx, dy: newDy };
}


document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy !== 1) { 
                nextDirection = { dx: 0, dy: -1 };
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy !== -1) { 
                nextDirection = { dx: 0, dy: 1 };
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx !== 1) { 
                nextDirection = { dx: -1, dy: 0 };
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx !== -1) { 
                nextDirection = { dx: 1, dy: 0 };
            }
            break;
    }
});

window.addEventListener('resize', () => {
    setupCanvas();
    drawGame();
});
