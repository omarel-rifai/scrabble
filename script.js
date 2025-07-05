const tileValues = {
  A: 1, B: 3, C: 3, D: 2, E: 1,
  F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1,
  P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4,
  Z: 10
};

const bonuses = [
  "", "", "double-word", "", "", "",
  "double-letter", "", "double-letter", "", "", "",
  "double-word", "", ""
];

let currentTiles = [];

function getRandomTiles(count = 7) {
  const letters = Object.keys(tileValues);
  const newTiles = [];
  for (let i = 0; i < count; i++) {
    const letter = letters[Math.floor(Math.random() * letters.length)];
    newTiles.push(letter);
  }
  return newTiles;
}

function populateRack() {
  const rack = $("#rack-tiles").empty();
  currentTiles = getRandomTiles();
  currentTiles.forEach((letter) => {
    const img = $(`<img src="Scrabble_Tile_${letter}.jpg" class="tile" data-letter="${letter}">`);
    img.draggable({
      revert: "invalid",
      helper: "clone"
    });
    rack.append(img);
  });
}

function createBoard() {
  const board = $("#scrabble-row").empty();
  for (let i = 0; i < 15; i++) {
    const square = $(`<div class="square" data-index="${i}"></div>`);
    square.css("left", `${i * 60}px`);
    square.droppable({
      accept: ".tile",
      drop: function(event, ui) {
        if ($(this).children().length > 0) return;

        const tile = ui.draggable.clone();
        tile.removeClass("ui-draggable-dragging");
        tile.css({ position: "relative", top: 0, left: 0 });
        $(this).append(tile);
        tile.draggable("disable");
        updateScore();
      }
    });
    board.append(square);
  }
}

function updateScore() {
  let score = 0;
  let wordMultiplier = 1;

  $(".square").each(function () {
    const tile = $(this).children(".tile");
    if (tile.length > 0) {
      const letter = tile.data("letter");
      let val = tileValues[letter];

      const bonus = bonuses[$(this).data("index")];
      if (bonus === "double-letter") val *= 2;
      if (bonus === "triple-letter") val *= 3;
      if (bonus === "double-word") wordMultiplier *= 2;
      if (bonus === "triple-word") wordMultiplier *= 3;

      score += val;
    }
  });

  $("#score").text(score * wordMultiplier);
}

function resetGame() {
  populateRack();
  createBoard();
  $("#score").text("0");
}

$(document).ready(function () {
  resetGame();

  $("#submit-word").click(function () {
    alert("Final score: " + $("#score").text());
  });

  $("#reset-game").click(function () {
    resetGame();
  });
});
