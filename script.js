// Select all elements
let buttonsRef = document.querySelectorAll(".game-box");
let popupRef = document.querySelector(".popup");
let restartBtn = document.getElementById("restart-btn");
let newGameBtn = document.getElementById("new-game");
let messageRef = document.getElementById("message");

// Winning patterns
let winningPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Initial states
let xTurn = true;
let count = 0;

// Disable all buttons
const disableButtons = () => {
    buttonsRef.forEach((element) => {
        element.disabled = true;
    });
    popupRef.classList.remove("hide");
};

// Enable buttons
const enableButtons = () => {
    buttonsRef.forEach((element) => {
        element.innerText = "";
        element.disabled = false;
    });
    popupRef.classList.add("hide");
    messageRef.innerHTML = ""; // Clear message
};

// Win function
const winFunction = (letter) => {
    disableButtons();
    if (letter == "X") {
        messageRef.innerHTML = "&#x1F389 <br> 'X' Wins!";
    } else {
        messageRef.innerHTML = "&#x1F389 <br> 'O' Wins!";
    }
};

// Draw function
const drawFunction = () => {
    disableButtons();
    messageRef.innerHTML = "&#x1F60E; <br> It's a Draw!";
};

// Check for a win
const winChecker = () => {
    for (let i of winningPattern) {
        let [element1, element2, element3] = [
            buttonsRef[i[0]].innerText,
            buttonsRef[i[1]].innerText,
            buttonsRef[i[2]].innerText,
        ];
        if (element1 != "" && element2 != "" && element3 != "") {
            if (element1 == element2 && element2 == element3) {
                setTimeout(() => {
                    winFunction(element1);
                }, 200);
                return true;
            }
        }
    }
    return false;
};

// Evaluate the game state
const evaluateBoard = () => {
    for (let pattern of winningPattern) {
        let [a, b, c] = pattern;
        if (
            buttonsRef[a].innerText &&
            buttonsRef[a].innerText === buttonsRef[b].innerText &&
            buttonsRef[a].innerText === buttonsRef[c].innerText
        ) {
            return buttonsRef[a].innerText === "O" ? 10 : -10;
        }
    }
    return 0;
};

// Check if moves are left
const isMovesLeft = () => {
    return [...buttonsRef].some((button) => button.innerText === "");
};

// Minimax Algorithm
const minimax = (isMaximizing) => {
    let score = evaluateBoard();

    if (score === 10) return score; // CPU Wins
    if (score === -10) return score; // Player Wins
    if (!isMovesLeft()) return 0; // Draw

    if (isMaximizing) {
        let best = -Infinity;
        buttonsRef.forEach((button) => {
            if (button.innerText === "") {
                button.innerText = "O";
                best = Math.max(best, minimax(false));
                button.innerText = "";
            }
        });
        return best;
    } else {
        let best = Infinity;
        buttonsRef.forEach((button) => {
            if (button.innerText === "") {
                button.innerText = "X";
                best = Math.min(best, minimax(true));
                button.innerText = "";
            }
        });
        return best;
    }
};

// Find the best move
const findBestMove = () => {
    let bestVal = -Infinity;
    let bestMove = -1;

    buttonsRef.forEach((button, index) => {
        if (button.innerText === "") {
            button.innerText = "O";
            let moveVal = minimax(false);
            button.innerText = "";

            if (moveVal > bestVal) {
                bestVal = moveVal;
                bestMove = index;
            }
        }
    });

    return bestMove;
};

// CPU Move (Hard Difficulty)
const cpuMove = () => {
    let bestMove = findBestMove();

    if (bestMove !== -1) {
        buttonsRef[bestMove].innerText = "O";
        buttonsRef[bestMove].disabled = true;
        count++;
        if (winChecker()) return;
        if (count === 9) drawFunction();
        xTurn = true; // Hand back control to player
    }
};

// Player click events
buttonsRef.forEach((element) => {
    element.addEventListener("click", () => {
        if (xTurn) {
            xTurn = false;
            element.innerText = "X";
            element.disabled = true;
            count++;

            // Check for win or draw
            if (winChecker()) {
                return;
            } else if (count === 9) {
                drawFunction();
            } else {
                // CPU makes a move
                setTimeout(cpuMove, 500); // Add delay for better UX
            }
        }
    });
});

// New Game and Restart buttons
newGameBtn.addEventListener("click", () => {
    count = 0;
    xTurn = true;
    enableButtons();
});

restartBtn.addEventListener("click", () => {
    count = 0;
    xTurn = true;
    enableButtons();
});

// Enable buttons on page load
window.onload = enableButtons;
