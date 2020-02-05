# Red-Tetris-42

This is a project for Unit Factory, aka School 42.

# Technologies:
TypeScript, React, Redux, Node, Socket.io, SCSS.

## To run project locally
In separate terminal windows run `npm run srv-dev`, `npm run client-dev`

## Summury
This is a classic tetris game.
To play you need create a room.
Be carefull, music will play loud once you enter the room.
Other users can join to your room, if a player name is uniq and a game hasn't started.

Once you complete a line, your score will be increased, unless you have positive lines completed count.
Simultaneously completed lines will give you:
1 line - 20 points
2 lines - 40 points
3 lines - 80 points
4 lines - 160 points
As soon as on of your opponents complete a line you will get - line from your lines completed.

Details you can read in red-tetris.pdf

## Test
Unit tests with jest. Run `npm run test:ci` to check coverage. It will be compiled into `coverage` -> index.html.

If you ❤️ the game, please give a 🌟 to this repo 😉
