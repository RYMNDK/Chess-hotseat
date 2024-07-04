# HotSeat Chess V0.0.1

A simple chess app written in React Typescript. Backend is .Net web api with SingalR for board synchronizing. 
The initial idea is have 2 people play chess with each other using pencil and eraser with some vertical lines drawn on a notebook.

## Features

This is current a MVP, and it has the following feature

- Moving pieces: clicking a piece will highlight places in the board for available moves. Clicking any spot in the board will have the highlighted piece move to that square.
- Synchronizing the board: when a move is mode ALL player will see the change
- Recording moves: All moves will be listed in move history in full algebraic notation.
- Special moves: can be achieved by using the buttons on the side.  
- Free place mode: place pieces on the board 
- Display last move played

## How it works

The Front end is resposible for managing the game state from FEN (UI) as well as importing/exporting the FEN. You can write your own Frontend in a different language if you want and it will be compatable.
Backend has a SQLite database and in memory matchmaking queue. On connecting a hub the client is given the the id of a room that is currently waiting, or a new room is created if there is no waiting rooms.
The Frontend will send the updated FEN to the backend and backend will broadcast the updated FEN to the other player.
Import and export FEN is handled by the front end.

## Upcoming features
- Action based approach: reduce FEN calculations and support more complex UI cases
- Have spectators.
- Roll back board states
- Testing and CI/CD
- PGN support
- Advanced Validation (moving a piece away from a king pin is not legal)
- Timers and timed game modes
- Theme
- Drag and drop pieces.

# Setup
This project is made with React Typescript frontend and dotnet core 8. WebSocket is provided with SignalR.

## Running Locally

if you want to play without hub connection

cd reactchess.client && npm run dev 

CORS is configured to accept connection from localhost:3000 and 3001, Frontend will run on 3000 and 3001. 

cd ReactChess.Server && dotnet run

cd reactchess.client && npm run dev 

