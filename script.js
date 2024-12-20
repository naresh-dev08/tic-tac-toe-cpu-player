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
};

// Win function
const winFunction = (letter) => {
    disableButtons();
    if (letter == "X") {
        messageRef.innerHTML = "&#x1F389 <br> 'X' Wins";
    } else {
        messageRef.innerHTML = "&#x1F389 <br> 'O' Wins";
    }
};

// Draw function
const drawFunction = () => {
    disableButtons();
    messageRef.innerHTML = "&#x1F60E; <br> It is a Draw";
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

// CPU move (easy level: random)
const cpuMove = () => {
    let available = [];
    buttonsRef.forEach((button, index) => {
        if (button.innerText === "") {
            available.push(index);
        }
    });

    if (available.length > 0) {
        // Choose a random available index
        let randomIndex = available[Math.floor(Math.random() * available.length)];
        buttonsRef[randomIndex].innerText = "O";
        buttonsRef[randomIndex].disabled = true;
        count++;
        if (count === 9) {
            drawFunction();
        } else if (winChecker()) {
            return;
        }
        xTurn = true; // Give control back to player
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
