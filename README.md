# Chess 
> **NOTE:** this version of chess can only be used in order to play by two players on one device

This project is chess. It created by using JavaScript, HTML, CSS, node JS.

### What can this project provide you?
<hr>

* universal board
* chess engine
* easy integration into your project

### How to run it on your device?
<hr>

> **NOTE:** you need to have node js on your machine
1. write in your terminal ```git clone <https or ssh addres>```
2. open the folder of project and write in terminal ```node server.js```
3. in your web browser write ```http://localhost:3000/getFile?=game/game.html```

After that you will see chess board. You can start play.

### How to use game?
<hr>

**To create board use:** 
```javascript
const board = new Board(cellNumberHorizontal, cellNumberVertical);
```

**To add figure use:**
```javascript
board.addFigure(defaultChessPosition, colors.WHITE, colors.BLACK);
```

>**NOTE:** you need **defaultChessPosition** object

like that:

```javascript
export const defaultChessPosition = {
  startPos: 'rnbqkbnr/pppppppp/00000000/00000000/00000000/00000000/pppppppp/rnbqkbnr', // future arrangement of figures
  forColor: colors.WHITE, // for which color figures arrangement
  cellNumberHorizontal: 8, // number of cells horizontally 
  cellNumberVertical: 8, // number of cells vertically
  figureNumberOnePlayer: 16 // one player figures (board have to understand when change color)
}
```

**To create game use:**

```javascript
const game = new Game(board); // first argument is a board which you created earlier
```

**To see game use:**

```javascript
const boardHtml = document.querySelector('.board'); // it can be any div element
const view = new View(boardHtml, game);
view.drawBoard();
```

### License
<hr>

[MIT License](LICENSE)