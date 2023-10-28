import { useState } from "react";
import "./styles.css";
import Board from "./chessboard.js";
let initialMoves = ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"];
export default function CChessBoard() {
  const [history, setHistory] = useState([]);
  const [correctMove, setCorrectMove] = useState(initialMoves[0]);
  const [opposingMove, setOpposingMove] = useState(initialMoves[1]);
  const [moves, setMoves] = useState(initialMoves);

  const handleOutcome = (outcome) => {
    console.log({ outcome: outcome });

    if (outcome === false) {
      // do failed logic (callback?)
    }

    if (outcome === true) {
      // do success logic (callback?)
    }

    setHistory((prevHistory) => {
      let movesCopy = [...moves];
      let newMove = movesCopy.shift();
      prevHistory.push(newMove);
      let lastOpposingMove = movesCopy.shift();
      prevHistory.push(lastOpposingMove);
      console.log({ history: history });
      return prevHistory;
    });

    setMoves((prevMoves) => {
      prevMoves.shift();
      prevMoves.shift();
      console.log({ prevMoves: prevMoves });
      return prevMoves;
    });

    setCorrectMove(moves[0]);
    setOpposingMove(moves[1]);
  };

  return (
    <>
      <div className="App"></div>
      <Board
        correctMove={correctMove}
        opposingMove={opposingMove}
        orientation={"white"}
        outcomeCallback={handleOutcome}
      />
    </>
  );

}
