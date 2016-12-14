'use strict';
var gLevel = {size : 11, mines : 2};
var gBoard;
var gCellsLeft = 0;
var timeEl = document.querySelector('#time');
var mineCountEl = document.querySelector('#mines');
var gTimer;

// Reset the game
function initGame() {
    gBoard = buildBoard(gLevel.size,gLevel.mines);
    renderBoard(gBoard,'.mineBoard');
    gCellsLeft = (gLevel.size * gLevel.size) - gLevel.mines;
    mineCountEl.innerHTML = gLevel.mines;
    clearInterval(gTimer);
    timeEl.innerHTML = 0;
    setSmiley('def');
}
// update the timer
function updateTimer() {
    timeEl.innerHTML++;
}

// upon cell click
function cellClicked(cell) {
    // starts round timer
    if (gCellsLeft === (gLevel.size * gLevel.size) - gLevel.mines) {
        gTimer = setInterval(updateTimer, 1000);
    }
    var cellCoord = getCellCoord(cell.id);
    var cellObj = gBoard[cellCoord.i][cellCoord.j];
    // if the cell was not clicked already or flagged checks it's contant.
    if (cellObj.flagged === false && cellObj.visible === false && gCellsLeft !== 0) {
        switch (cellObj.contain) {
            case 'mine':
                gameOver(cellObj);
                break;
            case 'empty':
                autoReveal(cell);
                if (gCellsLeft === 0) {
                   gameWin();
                }
                break;
            default:
                revealCell(cell);
                if (gCellsLeft === 0) {
                   gameWin();
                }
        }
    }
}

// if the user holds the right mouse click
function aboutToPress(cell) {
    cell.draggable = false;
    setSmiley('o');
}
// reset smiley after click
function cancelPress(cell) {
    if (gCellsLeft !== 0) {
    cell.draggable = false;
    setSmiley('def');
    }
}

// Flagg the specific cell or unflagg it
function cellMarked(cell) {
    var cellCoord = getCellCoord(cell.id);
    var cellObj = gBoard[cellCoord.i][cellCoord.j];
    if (cellObj.flagged === false && cellObj.visible === false) {
        updateCellTo(cell,'flag');
        mineCountEl.innerHTML--;
        cellObj.flagged = true;
    } else if (cellObj.flagged === true && cellObj.visible === false) {
        updateCellTo(cell,'hidden');
        mineCountEl.innerHTML++;
        cellObj.flagged = false;
    }
}
// Reveal the cells near the specific cell
function autoReveal(cell) {
    var cellCoord = getCellCoord(cell.id);
    var cellI = cellCoord.i;
    var cellJ = cellCoord.j;
    recReveal(cellI,cellJ);

    function recReveal(i,j) {
        if(isOutOfBounds(i, j) || isFilled(i, j)){
            return;
        }
        var tdCell = document.querySelector('#cell-' + i + '-' +j);
        revealCell(tdCell);
        if (gBoard[i][j].contain === 'empty') {
        recReveal(i - 1,j);
        recReveal(i,j + 1);
        recReveal(i + 1,j);
        recReveal(i,j - 1);
        }
    }
}
function isOutOfBounds(i, j){
    return i < 0 || gLevel.size === i || j < 0 || gLevel.size === j;
}
function isFilled(i, j){
    return gBoard[i][j].contain === 'mine' || gBoard[i][j].flagged === true || gBoard[i][j].visible === true
}

// Builds the game bord with obj and images.
function buildBoard(size,minesAmount) {
    var board = [];
    for (var i =0; i< size; i++) {
        board[i] = [];
        for (var j =0; j< size; j++) {
            var char = 'hidden';
            var imgSet = '<img class="cellImg"'+
                         ' onmousedown="aboutToPress(this)"'+
                         ''+
                         'onmouseup="cancelPress(this)"'+
                        'src="img/char_' + char + '.jpg" alt="' + char + '">'
            board[i][j] = {markAs : imgSet, contain : 'empty', visible : false, flagged: false};
        }
    }
    // Place mines in random location.
    var boardWithMines = placeMines(board,minesAmount);
    function placeMines(board,mines) {
    var minesCount = 0;
    while (minesCount < mines) {
        var i = Math.floor((Math.random() * board.length) + 0);
        var j = Math.floor((Math.random() * board.length) + 0);
        if (board[i][j].contain !== 'mine') {
            board[i][j].contain = 'mine';
            minesCount++;
        }
    }
    return board;
    }
    // checks where the mines where placed.
    setMinesNegsCount(board);
    function setMinesNegsCount(board) {
        board.forEach(function(rows, i) {
            rows.forEach(function(cellObj, j) {
                if (cellObj.contain !== 'mine') {
                    var negNum = countNegs(i,j);
                    cellObj.contain = negNum;
                }
            });
        });
    }
    // counts the mines near each cell and update the obj.
    function countNegs(cellI,cellJ) {
    var negs = 0;
    for (var i =cellI-1; i <= cellI+1; i++) {
        for (var j =cellJ-1; j <= cellJ+1; j++) {
            if ( i === cellI && j === cellJ ) continue;
            if ( i < 0 || i > board.length-1) continue;
            if ( j < 0 || j > board[0].length-1) continue;
            if (board[i][j].contain === 'mine') {negs++;}
        }
    }
    if (negs === 0) {negs = 'empty';}
    return negs;
    }
    return boardWithMines;
}

// print the Board that was built into index.html
function renderBoard(board, elSelector) {
    var strHtml = '';
    board.forEach(function(cells, i){
        strHtml += '<tr>';
        cells.forEach(function(cell, j){
            var className = 'cell';
            var tdId = 'cell-' + i + '-' +j;
            strHtml += '<td id="'+ tdId +'" onclick="cellClicked(this)" oncontextmenu="cellMarked(this)" class="' +
                         className + '">' + cell.markAs +  '</td>';
        });
        strHtml += '</tr>';
    });
    var elMat = document.querySelector(elSelector);
    elMat.innerHTML = strHtml;
}

function gameOver(mineObj) {
    mineObj.contain = 'mineBoom';
    revealAllBord();
    clearInterval(gTimer);
    setSmiley('lose');
}

function gameWin() {
    gBoard.forEach(function(rows, i) {
        rows.forEach(function(cellObj, j) {
            if (cellObj.contain === 'mine') {
                cellObj.contain = 'flag';
            }
        });
    });
    revealAllBord();
    clearInterval(gTimer);
    setSmiley('win');
}

/*
//Unit test functions
// chack bord for mines count
for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
        if (board[i][j].contain === 'mine') {
            console.log('found mine');
        }
    }
}
*/