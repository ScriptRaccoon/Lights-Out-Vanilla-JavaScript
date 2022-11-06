const boardElement = document.getElementById("board");
const winElement = document.getElementById("win");
const restartBtn = document.getElementById("restartBtn");
const randomizeBtn = document.getElementById("randomizeBtn");
const sizeInput = document.getElementById("sizeInput");

let checkBoxes = [];
let size = 5;
let boxesOff = [];

init();

function init() {
  createBoard();
  initializeCheckBoxes();
  boardElement.style.setProperty("--size", size);
  boardElement.addEventListener("change", ({ target }) => {
    if (target instanceof HTMLInputElement) {
      const { x, y } = target.dataset;
      /*
			"x | 0" is a neat little binary operator trick:
			the JS engine parses "x" as a number and strips decimal numbers.
			This is technical equivalent to `Math.floor(parseFloat(x))`
			*/
      changeCheckBox(x | 0, y | 0);
    }
  });
  restartBtn.addEventListener("click", restartGame);
  randomizeBtn.addEventListener("click", randomizeGame);
  sizeInput.value = size;
  sizeInput.addEventListener("change", resizeGame);
}

function createBoard() {
  /*
	don't use boardElement.innerHTML = ""; as reset, it needs to go through the HTML-Parser.
	Use innerText, because it's "just" text and therefore less computational expensive
	*/
  boardElement.innerText = "";
  checkBoxes = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      /*
			to pass `x` and `x` to the "change" event handler, we use the `dataset` property.
			Sidenote: Every DOM-Element knows it's own dataset and the properties will be converted as strings.
			You can write this elements like <input type="checkbox" data-x="1" data-y="5" /> in your HTML
			*/
      checkBox.dataset.x = x;
      checkBox.dataset.y = y;
      checkBoxes.push(checkBox);
      boardElement.appendChild(checkBox);
    }
  }
}

function initializeCheckBoxes() {
  checkBoxes.forEach(function (checkBox) {
    checkBox.checked = !boxesOff.includes(checkBox);
  });
}

function getCheckBox(x, y) {
  /*
	To access an element from a 1-Dimensional (1D) array in a 2D fassion:
	(1) compute the current row by width * column-size and (2) add the column.
	In long terms:

	const row = y * size;
	const column = x;
	const atIndex = row + column;

	return checkBoxes[atIndex]
	*/
  /* Also to mention: avoid DOM-access (especially writes), whenever you can. They are slow! */
  return checkBoxes[y * size + x];
}

function toggle(checkBox) {
  checkBox.checked = !checkBox.checked;
}

function changeCheckBox(x, y) {
  if (x > 0) toggle(getCheckBox(x - 1, y));
  if (y > 0) toggle(getCheckBox(x, y - 1));
  if (x < size - 1) toggle(getCheckBox(x + 1, y));
  if (y < size - 1) toggle(getCheckBox(x, y + 1));
  checkWin();
}

function checkWin() {
  const hasWon = checkBoxes.every(function (checkBox) {
    return !checkBox.checked;
  });
  if (hasWon) {
    winElement.classList.add("visible");
  }
}

function restartGame() {
  winElement.classList.remove("visible");
  initializeCheckBoxes();
}

function randomizeGame() {
  boxesOff = [];
  checkBoxes.forEach(function (checkBox) {
    if (Math.random() < 0.5) {
      boxesOff.push(checkBox);
    }
  });
  restartGame();
}

function resizeGame() {
  /* No need to parse, if the value is read as number.
	Sidenote: parseInt(x) without the base parameter accepts every kind of notation:
		- "0xF" will return 15: it's interpreted as HEX value.
		- "1e3" will return 100, it's interpreted as a scientific notation.
	 */
  const newSize = sizeInput.valueAsNumber;
  /* a size of 0 doesn't make sense here,
		so i check of values greater then 0, instead of  */
  if (newSize > 0) {
    size = newSize;
    boxesOff = [];
    createBoard();
    boardElement.style.setProperty("--size", size);
    restartGame();
  }
}
