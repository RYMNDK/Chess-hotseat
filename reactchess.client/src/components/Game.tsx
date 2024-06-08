import React, { useState } from "react";

import Board from "./Board";
import "./Game.css";

const Game: React.FC = () => {
    const [isWhiteTurn, setIsWhiteTurn] = useState(true);
    const [message, setMessage] = useState("");
    // const [moves, setMoves] = useState([]:Array<string>);

    const MockFEN: string =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    return (
        <div className="main">
            <div className="left">
                <Board />
            </div>
            <div className="right">
                <h1>{isWhiteTurn ? "White" : "Black"} to play</h1>
                <h2 className="GameAlerts" onClick={() => setMessage("")}>
                    {message}
                </h2>
                <div>
                    {/* optional, add a + in the move history*/}
                    <button
                        className="CheckButton"
                        onClick={() => setMessage("Check!")}
                    >
                        Check!
                    </button>
                    <button onClick={() => setIsWhiteTurn(!isWhiteTurn)}>
                        End turn
                    </button>
                    <button
                        onClick={() => {
                            confirm("Forfeit game?")
                                ? setMessage("I resign, good game! 🤝")
                                : // push end game onto move history
                                  // swap players
                                  null; // do not forfeit
                        }}
                    >
                        Resign
                    </button>
                </div>
                <div>
                    {/*
                        on clicking castle push the notation into history and 
                    */}
                    <button onClick={() => {}}>Short Castle</button>
                    <button onClick={() => {}}>Long Castle</button>
                </div>

                {/* <label>Move History</label>
            <ol>
            {moves.map((element, index) => (
                <li key={index}>{element}</li>
                ))}
                </ol> 
                                    <button>Undo</button>
                */}

                {/*
                    I want to start a new game without refreshing the page.
                */}
            </div>
        </div>
    );
};

export default Game;
