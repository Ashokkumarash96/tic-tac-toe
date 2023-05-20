"use strict";

// Get the grid element from the HTML document
const gridElement = document.getElementById("grid");

// Define a class for the TicTacToe game logic
class TicTacToe {
  // Define a constructor that takes the root element and the grid size as parameters
  constructor(root, gridSize = 3) {
    // Assign the parameters to the instance properties
    this.gridSize = gridSize;
    this.root = root;
    // Initialize an empty array to store the grid cells
    this.grid = [];
    // Initialize the current player to X
    this.currentPlayer = "X";
    // Initialize the winner to null
    this.winner = null;
    // Initialize the number of cells filled to 0
    this.cellFilled = 0;
    // Populate the grid with buttons
    this.populateGrid();
    // Add event listeners to handle user clicks
    this.addEventListeners();
  }

  // Define a method to populate the grid with buttons and store them in the grid array
  populateGrid() {
    // Append the created grid fragment to the root element
    this.root.appendChild(this.createGrid());
    // Get the children elements of the root element
    const elements = this.root.children;
    // Loop through the grid size and slice the elements array into subarrays of equal size
    for (let i = 0; i < this.gridSize; i++) {
      this.grid[i] = Array.from(elements).slice(
        i * this.gridSize,
        i * this.gridSize + this.gridSize
      );
    }
  }

  // Define a method to create a document fragment with buttons for each cell in the grid
  createGrid() {
    // Create a new document fragment
    const fragment = document.createDocumentFragment();
    // Loop through the grid size and create a button element for each cell
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = document.createElement("button");
        // Add a class name to the button element for styling
        cell.classList.add("cell");
        // Add data attributes to store the row and column indices of the cell
        cell.dataset.x = i;
        cell.dataset.y = j;
        // Append the button element to the fragment
        fragment.appendChild(cell);
      }
    }
    // Return the fragment
    return fragment;
  }

  // Define a method to add event listeners to handle user clicks on the grid cells
  addEventListeners() {
    // Add a click event listener to the root element
    this.root.addEventListener("click", (e) => {
      // Check if the target element is a cell and if there is no winner yet
      if (e.target.classList.contains("cell") && this.winner === null) {
        // Call the play method with the target element as an argument
        this.play(e.target);
      }
    });
  }

  // Define a method to handle the user's choice of a cell
  play(cell) {
    // Check if the cell is empty
    if (cell.textContent === "") {
      // Set the cell's text content to the current player's symbol
      this.set(cell.dataset.x, cell.dataset.y, this.currentPlayer);
      // Increment the number of cells filled by 1
      this.cellFilled += 1;
      // Check if there is a winner after this move
      if (this.checkWinner()) {
        // Set the winner property to the current player's symbol
        this.winner = this.currentPlayer;
        // Call the winner callback function if it exists and pass the winner as an argument
        this.winnerCallback?.(this.winner);
        return;
      } else if (this.cellFilled === this.gridSize * this.gridSize) {
        // If there are no more empty cells, set the winner property to "Draw"
        this.winner = "Draw";
        // Call the winner callback function if it exists and pass the winner as an argument
        this.winnerCallback?.(this.winner);
        return;
      }
      // Change to the next player's turn
      this.changePlayer();
    }
  }

  // Define a method to change the current player's symbol
  changePlayer() {
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
  }

  // Define a method to set a cell's text content to a given value based on its row and column indices
  set(row, col, value) {
    this.grid[row][col].textContent = value;
  }

  // Define a method to check if there is a winner after each move by checking all possible winning combinations
  checkWinner() {
    return (
      // Check if any row has a winner by calling isRowHasWinner method for each row index
      this.isRowHasWinner(0) ||
      this.isRowHasWinner(1) ||
      this.isRowHasWinner(2) ||
      // Check if any column has a winner by calling isColHasWinner method for each column index
      this.isColHasWinner(0) ||
      this.isColHasWinner(1) ||
      this.isColHasWinner(2) ||
      // Check if any diagonal has a winner by calling checkDiagonal and checkDiagonalReverse methods
      this.checkDiagonal() ||
      this.checkDiagonalReverse()
    );
  }

  // Define a method to check if a given row has a winner by comparing all its cells' text content with the first cell's text content
  isRowHasWinner(row) {
    const value = this.grid[row][0].textContent;
    if (this.grid[row].every((v) => v.textContent === value)) {
      return value;
    }
    return false;
  }

  // Define a method to check if a given column has a winner by comparing all its cells' text content with the first cell's text content
  isColHasWinner(col) {
    const value = this.grid[0][col].textContent;
    if (
      this.grid.map((row) => row[col]).every((v) => v.textContent === value)
    ) {
      return value;
    }
    return false;
  }

  // Define a method to check if the main diagonal has a winner by comparing all its cells' text content with the first cell's text content
  checkDiagonal() {
    const value = this.grid[0][0].textContent;
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i][i].textContent !== value) {
        return false;
      }
    }
    return value;
  }

  // Define a method to check if the reverse diagonal has a winner by comparing all its cells' text content with the first cell's text content
  checkDiagonalReverse() {
    const value = this.grid[0][2].textContent;
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i][this.grid.length - 1 - i].textContent !== value) {
        return false;
      }
    }
    return value;
  }

  // Define a method to reset all properties and elements of the game
  reset() {
    // Loop through each row and each cell and set their text content to empty
    this.grid.forEach((row) => {
      row.forEach((cell) => {
        cell.textContent = "";
      });
    });
    // Reset current player's symbol to X
    this.currentPlayer = "X";
    // Reset winner property to null
    this.winner = null;
    // Reset number of cells filled property to 0
    this.cellFilled = 0;
  }
}

// Create an instance of TicTacToe class and pass it gridElement as an argument
const ticTacToe = new TicTacToe(gridElement);
// Assign an anonymous function as winnerCallback property that takes in winner as an argument and displays it in HTML document
ticTacToe.winnerCallback = (winner) => {
  switch (winner) {
    case "X":
      document.getElementById("winner").textContent = "Player X won!";
      break;
    case "O":
      document.getElementById("winner").textContent = "Player O won!";
      break;
    default:
      document.getElementById("winner").textContent = "Draw!";
  }
};

// Add an event listener on reset button that calls reset method on ticTacToe instance and clears winner message in HTML document
document.getElementById("reset").addEventListener("click", () => {
  ticTacToe.reset();
  document.getElementById("winner").textContent = "";
});
