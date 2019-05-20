import { zipper, coordinateGenerator } from "./util.js";

class Game {
  createAdjacentNumber = function(number) {
    return [number - 1, number, number + 1];
  };

  isAlive = function(currentGeneration, cell) {
    return currentGeneration.some(
      element => element[0] === cell[0] && element[1] === cell[1]
    );
  };

  validateNeighbour = function() {
    return function(neighbour) {
      let { topLeft, bottomRight } = this.bound;
      let verifyRow =
        topLeft[0] <= neighbour[0] && neighbour[0] <= bottomRight[0];
      let verifyCol =
        neighbour[1] >= topLeft[1] && neighbour[1] <= bottomRight[1];
      return verifyRow && verifyCol;
    };
  };

  extractNeighbours = function(result, cell) {
    let position = JSON.parse(cell);
    let adjacentRow = this.createAdjacentNumber(position[0]);
    let adjacentCol = this.createAdjacentNumber(position[1]);
    let allNeighbours = adjacentRow.reduce(zipper(adjacentCol), []);
    allNeighbours.splice(4, 1);
    result[cell] = allNeighbours.filter(this.validateNeighbour.bind(this));
    return result;
  };

  initWorld = function() {
    let { topLeft, bottomRight } = this.bound;
    let rowCoordinates = coordinateGenerator(topLeft[0], bottomRight[0]);
    let colCoordinates = coordinateGenerator(topLeft[1], bottomRight[1]);
    let cells = rowCoordinates.reduce(zipper(colCoordinates), []);
    return cells.reduce((result, cell) => {
      result["[" + cell + "]"] = "D";
      return result;
    }, {});
  };

  countAliveNeighbours = function(allNeighbours, currentGeneration) {
    return function(result, cell) {
      let neighbourCount = 0;
      let neighbours = allNeighbours[cell];
      for (let neighbour of neighbours) {
        this.isAlive(currentGeneration, neighbour) && neighbourCount++;
      }
      result[cell] = neighbourCount;
      return result;
    };
  };

  verifyRules = function(neighbourCount, currentGeneration, cell) {
    let element = JSON.parse(cell);
    let alive =
      neighbourCount[cell] === 2 && this.isAlive(currentGeneration, element);
    return alive || neighbourCount[cell] === 3;
  };

  nextGeneration = function(currentGeneration, bound) {
    this.bound = bound;
    let keys = Object.keys(this.initWorld());
    let neighbours = keys.reduce(this.extractNeighbours.bind(this), {});
    let countAlive = this.countAliveNeighbours.bind(
      this,
      neighbours,
      currentGeneration
    )();
    let neighbourCount = keys.reduce(countAlive.bind(this), {});
    let verify = this.verifyRules.bind(this, neighbourCount, currentGeneration);
    return keys.filter(verify).map(x => JSON.parse(x));
  };
}

export default Game;
