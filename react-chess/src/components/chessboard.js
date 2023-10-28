// import { Chessboard } from "react-chessboard";

// const Board = () => {
//   return (
//     <div>
//       <Chessboard id="BasicBoard" />
//     </div>
//   );
// };
// export default Board;

import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function PlayRandomMoveEngine(props) {
  const [game, setGame] = useState(new Chess());

  const [piece, setPiece] = useState("");
  const [pieceSquare, setPieceSquare] = useState("");
  const [optionSquares, setOptionSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [rightClickedSquares, setRightClickedSquares] = useState({});

  const { correctMove, opposingMove, orientation, outcomeCallback } = props;

  useEffect(() => {}, [props]);

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true
    });
    if (moves.length === 0) {
      return;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%"
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)"
    };
    setOptionSquares(newSquares);
  }

  function onSquareRightClick(square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour }
    });
  }

  function makeOpposingMove() {
    console.log({ opposingMove: opposingMove });
    if (opposingMove == null) return;

    let from = opposingMove.substring(0, 2);
    let to = opposingMove.substring(2);
    console.log({ from: from, to: to });
    safeGameMutate((game) => {
      game.move({ from: from, to: to });
    });
  }

  function onPieceClick(piece) {
    setPiece(piece);
  }

  function onSquareClick(targetSquare) {
    setRightClickedSquares({});
    // getMoveOptions(targetSquare); // need to figure out mobile move options
    setPieceSquare(targetSquare);
    if (piece === "") return;

    // attempt to make move
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: pieceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for example simplicity
    });
    setGame(gameCopy);

    // if invalid, setMoveFrom and getMoveOptions
    if (move === null) {
      return;
    }

    setPiece("");
    validateMove(pieceSquare, targetSquare);
    setMoveSquares({
      [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      [targetSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" }
    });

    return true;
  }

  function onDrop(sourceSquare, targetSquare) {
    let move = null;
    safeGameMutate((game) => {
        
        
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q" // always promote to a queen for example simplicity
      });
    });

    if (move === null) return false; // illegal move
    validateMove(sourceSquare, targetSquare);
    setMoveSquares({
      [sourceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      [targetSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" }
    });

    return true;
  }

  function validateMove(sourceSquare, targetSquare) {
    let move = sourceSquare + targetSquare;
    if (move === correctMove) {
      outcomeCallback(true);
      setTimeout(makeOpposingMove, 400);
    } else {
      outcomeCallback(false);
      // color incorrect square?
    }
    return;
  }

  function onMouseOverSquare(square) {
    getMoveOptions(square);
  }

  // Only set squares to {} if not already set to {}
  function onMouseOutSquare() {
    if (Object.keys(optionSquares).length !== 0) setOptionSquares({});
  }

  return (
    <Chessboard
      position={game.fen()}
      onPieceDrop={onDrop}
      boardOrientation={orientation}
      areArrowsAllowed={true}
      arePremovesAllowed={true}
      onPieceClick={onPieceClick}
      onSquareClick={onSquareClick}
      onSquareRightClick={onSquareRightClick}
      onMouseOverSquare={onMouseOverSquare}
      onMouseOutSquare={onMouseOutSquare}
      customSquareStyles={{
        ...moveSquares,
        ...optionSquares,
        ...rightClickedSquares
      }}
    />
  );
}
