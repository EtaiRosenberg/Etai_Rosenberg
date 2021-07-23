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

var gLives = 0;
var gFirstFlag = 0;
var gBoard = [];
var gFirstRow = -5;
var gFirstCol = -5;
var gFirstClick = 0;
var BOMB = -1;
var BOMBICON = '💣';
var gBombFlagged = 0;
var gRevealCount = 0;
var gDifficulty = BEGINNER;
var gTimer = 0;
var gTimePointer = new Date();

function createBoard() {

    var size = gDifficulty.size;
    for (var row = 0; row < size; row++) {

        gBoard.push([]);
        for (var col = 0; col < size; col++) {

            gBoard[row][col] = {
                content: 0
            };
        }
    }
    return gBoard;
}

function placeBombs() {

    var bombLoc = [];
    var size = gDifficulty.size;
    var bombsReady = 0;
    var numOfBombs = gDifficulty.numOfBombs;
    var randCol = 0;
    var randRow = 0;

    while (bombsReady != numOfBombs) {

        randCol = Math.floor((Math.random() * size));
        randRow = Math.floor((Math.random() * size));
        if (gBoard[randRow][randCol].content != BOMB && !(randRow == gFirstRow && randCol == gFirstCol)) {

            bombLoc.push({
                row: randRow,
                col: randCol
            });
            gBoard[randRow][randCol].content = BOMB;
            bombsReady++;
        }
    }
    return bombLoc
}

function drawBoard() {

    var numOfRows = gBoard.length;
    var numOfCols = gBoard[1].length;
    var htmlStr = '';
    for (var i = 0; i < numOfRows; i++) {
        htmlStr += '<tr>';

        for (var j = 0; j < numOfCols; j++) {

            if (gBoard[i][j].content == BOMB) {

                htmlStr += `<td id="cell-${[i]}-${[j]}" data-row="${[i]}" data-col="${[j]}"><button class="boxContent hidden bomb"> ${BOMBICON} </button>
                <button class="boxHidden" onclick="reveal(this)" oncontextmenu="flag(event, this)"></button>`

            } else if (i != gFirstRow || j != gFirstCol) {

                htmlStr += `<td id="cell-${[i]}-${[j]}" data-row="${[i]}" data-col="${[j]}"><button class="boxContent hidden"> ${gBoard[i][j].content} </button>
                <button class="boxHidden" onclick="reveal(this)" oncontextmenu="flag(event, this)"></button>`

            } else {

                htmlStr += `<td id="cell-${[i]}-${[j]}" data-row="${[i]}" data-col="${[j]}"><button class="boxContent"> ${gBoard[i][j].content} </button>
                <button class="boxHidden hidden" onclick="reveal(this)" oncontextmenu="flag(event, this)"></button>`

            }
            htmlStr += `<button class="boxFlag hidden" oncontextmenu ="unFlag(event, this)">🚩</button></td>`
        }

        htmlStr += '</tr>';
    }

    var mainBoard = document.querySelector("#mainBoard");
    mainBoard.innerHTML = htmlStr;
}

function nearBomb(bombLoc) {

    var rowCheck = 0;
    var colCheck = 0;
    for (var i = 0; i < bombLoc.length; i++) {

        for (var r = -1; r < 2; r++) {

            for (var c = -1; c < 2; c++) {

                rowCheck = bombLoc[i].row + r;
                colCheck = bombLoc[i].col + c;
                if (rowCheck >= 0 && rowCheck < gBoard.length && colCheck >= 0 && colCheck < gBoard.length) {

                    if (gBoard[rowCheck][colCheck].content != BOMB) {

                        gBoard[rowCheck][colCheck].content++
                    }
                }
            }
        }
    }
}

function flag(event, button) {

    gFirstFlag++;
    if (gFirstFlag === 1) {

        gTimePointer = new Date();
        gTimer = setInterval('runTimer()', 100);

    }

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

    gFirstClick++;
    gFirstFlag++;
    var row = button.parentElement.getAttribute("data-row");
    var col = button.parentElement.getAttribute("data-col");
    var content = button.parentElement.querySelector(".boxContent");

    if (gFirstClick === 1) {

        gTimePointer = new Date();
        gTimer = setInterval('runTimer()', 100);
        gFirstRow = row;
        gFirstCol = col;
        console.log(gFirstRow, gFirstCol)
        var bombLoc = placeBombs();
        nearBomb(bombLoc);
        drawBoard();
    } 

    if (content.classList.contains("bomb") && gLives > 0){

        console.log(gLives);
        gLives--;
        document.querySelector("#lives").innerHTML = "Lives:" + gLives;
    }

    if (content.classList.contains("bomb") && gLives == 0) {

        button.classList.add("hidden");
        content.classList.remove("hidden");
        revealBombsLose();
        document.querySelector("#reset").innerHTML = "😒";
        clearInterval(gTimer);

    } else if (!(content.classList.contains("bomb"))){

        button.classList.add("hidden");
        content.classList.remove("hidden");
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

function runTimer() {

    document.querySelector("#timer").innerHTML = parseInt((new Date().getTime() - gTimePointer.getTime()) / 1000);
}

function init() {

    gLives = 3;
    gFirstRow = -5;
    gFirstCol = -5;
    gFirstClick = 0;
    gFirstFlag = 0;
    gBoard = [];
    gBombFlagged = 0;
    gRevealCount = 0;

    clearInterval(gTimer);
    document.querySelector("#timer").innerHTML = 0;
    document.querySelector("#lives").innerHTML = "Lives:" +gLives;
    document.querySelector("#mainBoard").innerHTML = '';
    document.querySelector("#reset").innerHTML = "🙂";
    createBoard();
    drawBoard();
}