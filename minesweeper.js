'use strict'

// This is the minesweeper game maraton //

var BEGINNER = {
    size: 4,
    numOfBombs: 2
};
var MEDIUM = {
    size: 8,
    numOfBombs: 12
};
var EXPERT = {
    size: 12,
    numOfBombs: 30
};

var BOMB = -1;
var BOMBICON = '💣';
var gBombFlagged = 0;
var gRevealCount = 0;
var gDifficulty = BEGINNER;
var gTimer = 0;
var gTimePointer = new Date();

function createBoard() {

    var size = gDifficulty.size;
    var board = [];
    for (var row = 0; row < size; row++) {

        board.push([]);
        for (var col = 0; col < size; col++) {

            board[row][col] = {
                content: 0
            };
        }
    }
    return board;
}

function placeBombs(board) {

    var bombLoc = [];
    var size = gDifficulty.size;
    var bombsReady = 0;
    var numOfBombs = gDifficulty.numOfBombs;
    var randCol = 0;
    var randRow = 0;

    while (bombsReady != numOfBombs) {

        randCol = Math.floor((Math.random() * size));
        randRow = Math.floor((Math.random() * size));
        if (board[randRow][randCol].content != BOMB) {

            bombLoc.push({
                row: randRow,
                col: randCol
            });
            board[randRow][randCol].content = BOMB;
            bombsReady++;
        }
    }
    return bombLoc
}

function drawBoard(board) {

    var numOfRows = board.length;
    var numOfCols = board[1].length;
    var htmlStr = '';
    for (var i = 0; i < numOfRows; i++) {
        htmlStr += '<tr>';

        for (var j = 0; j < numOfCols; j++) {

            if (board[i][j].content == BOMB) {

                htmlStr += `<td data-row="${i}" data-col="${j}"><button class="boxContent hidden bomb"> ${BOMBICON} </button>`

            } else {

                htmlStr += `<td data-row="${i}" data-col="${j}"><button class="boxContent hidden"> ${board[i][j].content} </button>`

            }
            htmlStr += `<button class="boxFlag hidden" oncontextmenu ="unFlag(event, this)">🚩</button>
            <button class="boxHidden" onclick="reveal(this)" oncontextmenu="flag(event, this)"></button></td>`
        }

        htmlStr += '</tr>';
    }

    var mainBoard = document.querySelector("#mainBoard");
    mainBoard.innerHTML = htmlStr;
}

function nearBomb(board, bombLoc) {

    var rowCheck = 0;
    var colCheck = 0;
    for (var i = 0; i < bombLoc.length; i++) {

        for (var r = -1; r < 2; r++) {

            for (var c = -1; c < 2; c++) {

                rowCheck = bombLoc[i].row + r;
                colCheck = bombLoc[i].col + c;
                if (rowCheck >= 0 && rowCheck < board.length && colCheck >= 0 && colCheck < board.length) {

                    if (board[rowCheck][colCheck].content != BOMB) {

                        board[rowCheck][colCheck].content++
                    }
                }
            }
        }
    }
}

function flag(event, button) {

    event.preventDefault();
    button.classList.add("hidden");
    button.parentElement.querySelector(".boxFlag").classList.remove("hidden");

    if (button.parentElement.querySelector(".boxContent").classList.contains("bomb")) {

        gBombFlagged++;
    }
    winCondi();
}

function unFlag(event, button) {

    event.preventDefault();
    button.classList.add("hidden");
    button.parentElement.querySelector(".boxHidden").classList.remove("hidden");

    if (button.parentElement.querySelector(".boxContent").classList.contains("bomb")) {

        gBombFlagged--;
    }
}

function reveal(button) {

    var content = button.parentElement.querySelector(".boxContent");
    button.classList.add("hidden");
    content.classList.remove("hidden");

    if (content.classList.contains("bomb")) {
        revealBombsLose();
        document.querySelector("#reset").innerHTML = "😒";
        clearInterval(gTimer);

    } else {
        gRevealCount++;
        winCondi();
    }
}

function revealBombsLose() {

    var revealArr = document.querySelector("#mainBoard").querySelectorAll(".bomb");
    for (var i = 0; i < revealArr.length; i++) {

        revealArr[i].classList.remove("hidden");
        revealArr[i].parentElement.querySelector(".boxHidden").classList.add("hidden");
        revealArr[i].parentElement.querySelector(".boxFlag").classList.add("hidden");
    }
}

function winCondi() {

    console.log("hey");
    var size = gDifficulty.size;
    var numOfBombs = gDifficulty.numOfBombs;
    console.log(size * size - numOfBombs, gRevealCount, gBombFlagged, numOfBombs)
    if (size * size - numOfBombs == gRevealCount && gBombFlagged == numOfBombs) {

        document.querySelector("#reset").innerHTML = "😁";
        clearInterval(gTimer);
    }
}

function changeDifficulty(select) {

    var newDiff = select.value;
    if (newDiff == 1) {

        gDifficulty = BEGINNER;

    } else {

        gDifficulty = newDiff == 2 ? MEDIUM : EXPERT;
    }

    init();
}

function runTimer(){
    console.log(new Date().getSeconds());
    document.querySelector("#timer").innerHTML = parseInt((new Date().getTime() - gTimePointer.getTime()) / 1000);
}

function init() {

    clearInterval(gTimer);
    gTimePointer = new Date();
    gTimer = setInterval('runTimer()', 500);
    gBombFlagged = 0;
    gRevealCount = 0;
    document.querySelector("#mainBoard").innerHTML = '';
    var board = createBoard();
    var bombLoc = placeBombs(board);
    nearBomb(board, bombLoc);
    drawBoard(board);
    document.querySelector("#reset").innerHTML = "🙂";

}