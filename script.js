function Game(context, cellSize) {
  this.state = [
    [7, 2, 3],
    [4, 5, 8],
    [1, 6, 0],
  ];

  this.color = "#FFB93B";

  this.context = context;
  this.cellSize = cellSize;

  this.clicks = 0;
}

Game.prototype.getClicks = function () {
  return this.clicks;
};

Game.prototype.cellView = function (x, y) {
  this.context.fillStyle = this.color;
  this.context.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
};

Game.prototype.numView = function () {
  this.context.font = "bold " + this.cellSize / 2 + "px Sans";
  this.context.textAlign = "center";
  this.context.textBaseline = "middle";
  this.context.fillStyle = "#222";
};

Game.prototype.draw = function () {

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (this.state[i][j] > 0) {
        this.cellView(j * this.cellSize, i * this.cellSize);
        this.numView();
        this.context.fillText(
          this.state[i][j],
          j * this.cellSize + this.cellSize / 2,
          i * this.cellSize + this.cellSize / 2
        );
      }
    }
  }
};


Game.prototype.getNullCell = function () {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (this.state[j][i] === 0) {
        return { x: i, y: j };
      }
    }
  }
};

Game.prototype.move = function (x, y) {
  let nullCell = this.getNullCell();
  let canMoveVertical =
    (x - 1 == nullCell.x || x + 1 == nullCell.x) && y == nullCell.y;
  let canMoveHorizontal =
    (y - 1 == nullCell.y || y + 1 == nullCell.y) && x == nullCell.x;

  if (canMoveVertical || canMoveHorizontal) {
    this.state[nullCell.y][nullCell.x] = this.state[y][x];
    this.state[y][x] = 0;
    this.clicks++;
  }
};

Game.prototype.victory = function () {
  let combination = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ];
  let res = true;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (combination[i][j] != this.state[i][j]) {
        res = false;
        break;
      }
    }
  }
  return res;
};

window.onload = function () {
  let canvas = document.getElementById("canvas");
  canvas.width = 320;
  canvas.height = 320;

  let context = canvas.getContext("2d");
  context.fillRect(0, 0, canvas.width, canvas.height);

  let cellSize = canvas.width / 3;
  let game = new Game(context, cellSize);
  
  game.draw();

  canvas.onclick = function(e) {
    let x = (e.pageX - canvas.offsetLeft) / cellSize | 0;
    let y = (e.pageY - canvas.offsetTop)  / cellSize | 0;
    onEvent(x, y); 
  };
  function onEvent(x, y) {
    game.move(x, y);
    context.fillRect(0, 0, canvas.width, canvas.height);
    game.draw();
    if (game.victory()) {
      setTimeout(function(){
        alert("Собрано за " + game.getClicks() + " касание!");
      context.fillRect(0, 0, canvas.width, canvas.height);
      game.draw(context, cellSize);
      }, 500)
      
    }
  }
};
