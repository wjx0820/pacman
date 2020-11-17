import { GRID_SIZE, CELL_SIZE, OBJECT_TYPE, CLASS_LIST } from "./setup";

class GameBoard {
  constructor(DOMGrid) {
    this.dotCount = 0;
    this.grid = [];
    this.DOMGrid = DOMGrid;
  }

  static createGameBoard(DOMGrid, level) {
    const board = new this(DOMGrid);
    board.createGrid(level);
    return board;
  }

  showGameStatus(gameWin) {
    const div = document.createElement("div");
    div.classList.add("game-status");
    div.innerHTML = `${gameWin ? "🎉好棒喔🥳" : "GAME OVER😈"}`;
    this.DOMGrid.appendChild(div);
  }

  createGrid(level) {
    this.dotCount = 0;
    this.grid = [];
    this.DOMGrid.innerHTML = "";
    // 设置 columns
    this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px);`;

    level.forEach((square) => {
      const div = document.createElement("div");
      // LEVEL为1，则CLASS_LIST[square] = CLASS_LIST[1] = OBJECT_TYPE.WALL
      div.classList.add("square", CLASS_LIST[square]);
      div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px;`;
      this.DOMGrid.appendChild(div);
      this.grid.push(div);

      if (CLASS_LIST[square] === OBJECT_TYPE.DOT) this.dotCount++;
    });
  }

  addObject = (pos, classes) => {
    this.grid[pos].classList.add(...classes);
  };

  removeObject = (pos, classes) => {
    this.grid[pos].classList.remove(...classes);
  };

  objectExist = (pos, object) => {
    return this.grid[pos].classList.contains(object);
  };

  rotateDiv = (pos, deg) => {
    this.grid[pos].style.transform = `rotate(${deg}deg)`;
  };

  moveCharacter(character) {
    if (character.shouldMove()) {
      const { nextMovePos, direction } = character.getNextMove(
        this.objectExist
      );
      const { classesToRemove, classesToAdd } = character.makeMove();

      if (character.rotation && nextMovePos !== character.pos) {
        // Rotate
        this.rotateDiv(nextMovePos, character.dir.rotation);
        // Rotate the previous div back
        this.rotateDiv(character.pos, 0);
      }

      this.removeObject(character.pos, classesToRemove);
      this.addObject(nextMovePos, classesToAdd);

      character.setNewPos(nextMovePos, direction);
    }
  }
}

export default GameBoard;
