import React from "react";
import ReactDom from "react-dom";
import Game from "./gameOfLife.js";
import "./index.css";

class GameOfLife extends React.Component {
  constructor(props) {
    super(props);
    this.lastGeneration = [[0, 0], [0, 1], [0, 2], [2, 2], [1, 1], [3, 3]];
    this.bound = {
      topLeft: [0, 0],
      bottomRight: [10, 10]
    };
    this.game = props.game;
    this.createTable = this.createTable.bind(this);
    this.state = {
      nextGeneration: this.game.nextGeneration(this.lastGeneration, this.bound),
      lastGeneration: this.lastGeneration
    };
    this.updateCells = this.updateCells.bind(this);
  }

  componentDidMount() {
    this.updateCells();
  }
  render() {
    return this.createTable();
  }

  isSubset(index, index1) {
    return this.lastGeneration.some(combination => {
      return combination[0] === index && combination[1] === index1;
    });
  }

  makeCellLive(cell) {
    this.lastGeneration.push(cell);
  }
  createAndUpdateCell(index, index1) {
    if (this.isSubset(index, index1)) {
      return (
        <td
          onClick={this.makeCellLive.bind(this, [index, index1])}
          id={index + " " + index1}
          key={index + " " + index1}
          className="alive"
        />
      );
    }
    return (
      <td
        onClick={this.makeCellLive.bind(this, [index, index1])}
        id={index + " " + index1}
        key={index + " " + index1}
      />
    );
  }

  createTable() {
    const table = [];
    const { topLeft, bottomRight } = this.bound;
    for (let index = topLeft[0]; index < bottomRight[0]; index++) {
      const tableRow = [];
      for (let index1 = topLeft[1]; index1 < bottomRight[1]; index1++) {
        tableRow.push(this.createAndUpdateCell(index, index1));
      }
      table.push(<tr key={index}>{tableRow}</tr>);
    }
    return (
      <table>
        <tbody>{table}</tbody>
      </table>
    );
  }

  updateCells() {
    setInterval(() => {
      this.createTable();
      this.setState(state => ({
        lastGeneration: this.lastGeneration,
        nextGeneration: this.game.nextGeneration(
          this.lastGeneration,
          this.bound
        )
      }));
      this.lastGeneration = this.game.nextGeneration(
        this.lastGeneration,
        this.bound
      );
    }, 1000);
  }
}

const game = new Game();
ReactDom.render(<GameOfLife game={game} />, document.getElementById("root"));
