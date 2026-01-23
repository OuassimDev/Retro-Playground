var buttonclick = new Audio("./assets/audio/button-click.mp3")
function openGame(gameName) {
    buttonclick.play();
    const modal = document.getElementById('gameModal');
    const gameContainer = document.getElementById('gameContainer');
    
    modal.style.display = 'block';
    
    if (gameName === 'snake') {
        gameContainer.innerHTML = `
            <a href="./Games/Snake/Snake.html?mode=easy">
                <button>Easy</button>
            </a> 
            <a href="./Games/Snake/Snake.html?mode=hard">
                <button>Hard</button>
            </a>
        `;
      
    } else if (gameName === 'tictactoe') {
        gameContainer.innerHTML = `
            <a href="./Games/TicTacToe/TicTacToe.html?mode=p2">
                <button>P1 vs P2</button>
            </a> 
            <a href="./Games/TicTacToe/TicTacToe.html?mode=ai">
                <button>P1 vs AI</button>
            </a>
        `;
       
    } else if (gameName === 'memory') {
        gameContainer.innerHTML = `
            <a href="./Games/Memory/Memory.html?mode=easy">
                <button>Easy</button>
            </a> 
            <a href="./Games/Memory/Memory.html?mode=hard">
                <button>Hard</button>
            </a>
        `;
        
    } else if (gameName === 'guess') {
        gameContainer.innerHTML = `
            <a href="./Games/Guess/Guess.html?mode=guessthenumber">
                <button>Guess The Number</button>
            </a> 
            <a href="./Games/Guess/Guess.html?mode=guesstheword">
                <button>Guess The Word</button>
            </a>
        `;
        
    }
}

function closeGame() {
    const modal = document.getElementById('gameModal');
    modal.style.display = 'none';
    document.getElementById('gameContainer').innerHTML = '';
}

window.onclick = function(event) {
    const modal = document.getElementById('gameModal');
    if (event.target === modal) {
        closeGame();
    }
}

function fullscreen(){
    const modalc = document.getElementById("mdcontent");
    if(modalc.style.maxWidth!="100%"){
        modalc.style.maxWidth="100%";
    }
    else{
        modalc.style.maxWidth="800px";
    }
}