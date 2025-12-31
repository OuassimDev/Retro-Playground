let turn = document.getElementById("Turn");
let gameOver = false;
let isAIMode = false;
let playerSymbol = "X";
let aiSymbol = "O";

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'ai') {
        isAIMode = true;
        turn.textContent = "You are X - Your Turn";
    }
}

function CardClick(card) {
    if(gameOver) return;
    if(card.textContent !== "") return; 
    
    if(isAIMode) {
        
        if(turn.textContent.includes("Your Turn") || turn.textContent.includes("You are X")) {
            card.textContent = playerSymbol;
            card.style.color = "#FF6B6B";
            card.style.textShadow = "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000";
            card.style.pointerEvents = "none";
            
            if(!WinCondition()) {
                turn.textContent = "AI is thinking...";
                
                setTimeout(makeAIMove, 500);
            }
        }
    } else {
        
        if(turn.textContent === "X Turn") {
            card.textContent = "X";
            card.style.color = "#FF6B6B";
            card.style.textShadow = "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000";
            turn.textContent = "O Turn";
            card.style.pointerEvents = "none";
        }
        else if(turn.textContent === "O Turn") {
            card.textContent = "O";
            card.style.color = "#4ECDC4";
            card.style.textShadow = "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000";
            turn.textContent = "X Turn";
            card.style.pointerEvents = "none";
        }
        
        WinCondition();
    }
}

function makeAIMove() {
    if(gameOver) return;
    
    let bestMove = findBestMove();
    
    if(bestMove) {
        let cell = document.getElementById(bestMove);
        cell.textContent = aiSymbol;
        cell.style.color = "#4ECDC4";
        cell.style.textShadow = "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000";
        cell.style.pointerEvents = "none";
        
        if(!WinCondition()) {
            turn.textContent = "Your Turn";
        }
    }
}

function findBestMove() {
    
    let emptyCells = [];
    for(let i = 1; i <= 9; i++) {
        let cell = document.getElementById(i.toString());
        if(cell.textContent === "") {
            emptyCells.push(i.toString());
        }
    }
    
    if(emptyCells.length === 0) return null;

    for(let cell of emptyCells) {
        if(canWinWithMove(cell, aiSymbol)) {
            return cell;
        }
    }
    
  
    for(let cell of emptyCells) {
        if(canWinWithMove(cell, playerSymbol)) {
            return cell;
        }
    }
    
 
    if(emptyCells.includes("5")) {
        return "5";
    }
    
  
    let corners = ["1", "3", "7", "9"].filter(c => emptyCells.includes(c));
    if(corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
    }
    
    
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function canWinWithMove(cellId, symbol) {
   
    let cell = document.getElementById(cellId);
    let originalContent = cell.textContent;
    cell.textContent = symbol;
    
 
    let wins = checkWinForSymbol(symbol);
 
    cell.textContent = originalContent;
    
    return wins;
}

function checkWinForSymbol(symbol) {
    let c1 = document.getElementById("1").textContent;
    let c2 = document.getElementById("2").textContent;
    let c3 = document.getElementById("3").textContent;
    let c4 = document.getElementById("4").textContent;
    let c5 = document.getElementById("5").textContent;
    let c6 = document.getElementById("6").textContent;
    let c7 = document.getElementById("7").textContent;
    let c8 = document.getElementById("8").textContent;
    let c9 = document.getElementById("9").textContent;
    
  
    return (
        (c1 === symbol && c2 === symbol && c3 === symbol) ||
        (c4 === symbol && c5 === symbol && c6 === symbol) ||
        (c7 === symbol && c8 === symbol && c9 === symbol) ||
        (c1 === symbol && c4 === symbol && c7 === symbol) ||
        (c2 === symbol && c5 === symbol && c8 === symbol) ||
        (c3 === symbol && c6 === symbol && c9 === symbol) ||
        (c1 === symbol && c5 === symbol && c9 === symbol) ||
        (c3 === symbol && c5 === symbol && c7 === symbol)
    );
}

function WinCondition() {
    let c1 = document.getElementById("1").textContent;
    let c2 = document.getElementById("2").textContent;
    let c3 = document.getElementById("3").textContent;
    let c4 = document.getElementById("4").textContent;
    let c5 = document.getElementById("5").textContent;
    let c6 = document.getElementById("6").textContent;
    let c7 = document.getElementById("7").textContent;
    let c8 = document.getElementById("8").textContent;
    let c9 = document.getElementById("9").textContent;
    
    if(c1 && c1 === c2 && c2 === c3) {
        Winner(c1);
        return true;
    }
    if(c4 && c4 === c5 && c5 === c6) {
        Winner(c4);
        return true;
    }
    if(c7 && c7 === c8 && c8 === c9) {
        Winner(c7);
        return true;
    }
   
    if(c1 && c1 === c4 && c4 === c7) {
        Winner(c1);
        return true;
    }
    if(c2 && c2 === c5 && c5 === c8) {
        Winner(c2);
        return true;
    }
    if(c3 && c3 === c6 && c6 === c9) {
        Winner(c3);
        return true;
    }
    
    if(c1 && c1 === c5 && c5 === c9) {
        Winner(c1);
        return true;
    }
    if(c3 && c3 === c5 && c5 === c7) {
        Winner(c3);
        return true;
    }
    
    if(c1 && c2 && c3 && c4 && c5 && c6 && c7 && c8 && c9) {
        turn.textContent = "It's a Draw! 🤝";
        gameOver = true;
        return true;
    }
    
    return false;
}

function Winner(player) {
    if(isAIMode) {
        if(player === playerSymbol) {
            turn.textContent = "You Win! 🎉";
        } else {
            turn.textContent = "AI Wins! 🤖";
        }
    } else {
        turn.textContent = player + " Wins! 🎉";
    }
    
    gameOver = true;
    
    let cards = document.querySelectorAll(".cards div");
    cards.forEach(card => {
        card.style.pointerEvents = "none";
    });
}

function ResetGame() {
    gameOver = false;
    
    if(isAIMode) {
        turn.textContent = "You are X - Your Turn";
    } else {
        turn.textContent = "X Turn";
    }
    
    let cards = document.querySelectorAll(".cards div");
    cards.forEach(card => {
        card.textContent = "";
        card.style.pointerEvents = "auto";
        card.style.color = "";
    });
}