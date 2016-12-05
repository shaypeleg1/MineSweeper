'use strict'
// update the smiley button "def/o/lose/win"
function setSmiley(face) {
    document.querySelector('#smiley_img').src = 'img/smiley_' + face + '.jpg';
}

// update cell to specific img
function updateCellTo(cellTD,setTo) {
    var cellImg = cellTD.firstChild;
    var cellCoord = getCellCoord(cellTD.id);
    cellImg.src = 'img/char_' + setTo + '.jpg';
}

// reveal the cell contant from (obj to img) and counts the total revealed cells
function revealCell(cellTD) {
    var cellCoord = getCellCoord(cellTD.id);
    var cellContain = gBoard[cellCoord.i][cellCoord.j].contain;
    gBoard[cellCoord.i][cellCoord.j].visible = true;
    var cellImg = cellTD.firstChild;
    cellImg.src = 'img/char_' + cellContain + '.jpg';
    gCellsLeft--;
}

// get cell coordinates on mat from it's id
function getCellCoord(strCellId) {
    var coord = {i: 0, j : 0};
    coord.i = +strCellId.substring(5,strCellId.lastIndexOf('-'));
    coord.j = +strCellId.substring(strCellId.lastIndexOf('-')+1);
    return coord;
}

// reveal all the cells
function revealAllBord() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
        gBoard[i][j].visible = true;
        var cellContain = gBoard[i][j].contain;
            var tdId = '#cell-' + i + '-' +j;
            document.querySelector(tdId).firstChild.src = 'img/char_' + cellContain + '.jpg';
        }
    }
}