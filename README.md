# JavaScript chess tutorial

An introductory walkthrough for representing a chessboard and creating board elements in the browser.

## Read the tutorial

Open [CHESS JAVASCRIPT SOURCE CODE AND TUTORIAL.txt](CHESS%20JAVASCRIPT%20SOURCE%20CODE%20AND%20TUTORIAL.txt) in GitHub or download it and open it in a text editor.

## Current status

This repository contains tutorial text, not a complete playable chess application. The move-handler example stops at `else if (selected`, so copying the entire JavaScript example produces a syntax error.

The walkthrough references files that are not included:

- An HTML page containing `<div id="chessboard"></div>`.
- A `chess.js` file for the JavaScript snippets.
- CSS for `.row`, `.cell`, `.white`, `.black`, and `.selected`.
- Piece images under `images/`, with filenames matching the board letters. Uppercase and lowercase letters represent different pieces; filenames must remain distinct on the target filesystem.

## Continue the exercise

1. Create the HTML page shown in Step 1 and place `chess.js` beside it.
2. Copy the complete board setup and rendering snippets from Steps 2 and 3 into `chess.js`.
3. Add grid styling and your own piece assets.
4. Finish the move handler before including Step 4.
5. Open the HTML page in a browser and inspect the developer console for errors.

Legal moves, turns, check, checkmate, castling, promotion, and en passant still need implementations before this can function as a chess game.
