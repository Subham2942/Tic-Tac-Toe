const grid = document.querySelector(".grid");
const resetButton = document.getElementById("reset");
const gameOverMessage = document.getElementById("game-over-message");

let crossTurn = true;
let clickCount = 0;
let gameOver = false;
let limitedMode = false;

const classicBtn = document.getElementById("classic");
const limitedBtn = document.getElementById("limited");

classicBtn.addEventListener("click", () => {
  limitedMode = false;
  classicBtn.classList.add("active");
  limitedBtn.classList.remove("active");
  resetGame();
});

limitedBtn.addEventListener("click", () => {
  limitedMode = true;
  limitedBtn.classList.add("active");
  classicBtn.classList.remove("active");
  resetGame();
});

let xMoves = [];
let oMoves = [];

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

function checkWin() {
  return winningCombos.some(([a, b, c]) => {
    const cellsArr = document.querySelectorAll(".cell");
    return (
      cellsArr[a].classList.contains("clicked") &&
      cellsArr[b].classList.contains("clicked") &&
      cellsArr[c].classList.contains("clicked") &&
      cellsArr[a].innerHTML === cellsArr[b].innerHTML &&
      cellsArr[b].innerHTML === cellsArr[c].innerHTML
    );
  });
}

function createGrid() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    cell.addEventListener("click", function () {
      if (gameOver || this.classList.contains("clicked")) return;

      const index = [...grid.children].indexOf(this);
      const currentMoves = crossTurn ? xMoves : oMoves;

      if (limitedMode) {
        if (currentMoves.length === 3) {
          const oldest = currentMoves.shift();
          const oldCell = grid.children[oldest];
          oldCell.innerHTML = "";
          oldCell.classList.remove("clicked", "oldest");
        }
      }

      this.innerHTML = crossTurn
        ? '<img src="cross-svgrepo-com.svg" alt="X" width="80" height="80"/>'
        : '<img src="circle-svgrepo-com.svg" alt="O" width="80" height="80"/>';
      this.classList.add("clicked");

      if (limitedMode) {
        currentMoves.push(index);

        if (xMoves.length > 0)
          grid.children[xMoves[0]].classList.remove("oldest");
        if (oMoves.length > 0)
          grid.children[oMoves[0]].classList.remove("oldest");

        if (currentMoves.length === 3) {
          grid.children[currentMoves[0]].classList.add("oldest");
        }
      }

      clickCount++;

      if (checkWin()) {
        gameOver = true;
        gameOverMessage.innerText = crossTurn
          ? "Player X wins!"
          : "Player O wins!";
      } else if (!limitedMode && clickCount === 9) {
        gameOver = true;
        gameOverMessage.innerText = "It's a draw!";
      }

      crossTurn = !crossTurn;
      // re-evaluate flicker based on whose turn it now is
      if (limitedMode) {
        if (xMoves.length > 0)
          grid.children[xMoves[0]].classList.remove("oldest");
        if (oMoves.length > 0)
          grid.children[oMoves[0]].classList.remove("oldest");

        const nextMoves = crossTurn ? xMoves : oMoves;
        if (nextMoves.length === 3) {
          grid.children[nextMoves[0]].classList.add("oldest");
        }
      }
    });

    grid.appendChild(cell);
  }
}

function resetGame() {
  crossTurn = true;
  clickCount = 0;
  gameOver = false;
  xMoves = [];
  oMoves = [];
  gameOverMessage.innerText = "";
  grid.innerHTML = "";
  createGrid();
}

createGrid();
resetButton.addEventListener("click", resetGame);
