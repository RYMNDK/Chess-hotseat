# HotSeat Chess V0.0.0

A simple chess app written in React Typescript. There is no backend functionality at the moment.
The idea is have 2 people play chess with each other using pencil and eraser with some vertical lines drawn on a notebook.

## Features

This project is not yet a MVP, but it current have the following features

- Moving pieces: clicking a piece will highlight places in the board for available moves. Clicking any spot in the board will have the highlighted piece move to that square.
- Recording moves: All moves will be listed in move history in full algebraic notation.
- Special moves: can be achieved by using the buttons on the side.  
- Free place mode: place pieces on the board 
- Display last move played

## Upcoming features
- Full support a game (special moves)
- 2 player play with websockets
- import/export FEN
- Undo a move (on the board)
- PGN and reconstuction board from FEN and PGN
- Advanced Validation (moving a piece away from a king pin is not legal)
- Timers and timed game modes
- Theme
- Drag and drop pieces.

# Setup
This project is made with React Typescript frontend and dotnet core 8. WebSocket is provided with SignalR.

## Running Locally
npm install and npm run dev in reactchess.client