var gameBoard = {
    createBoard: function(dimension) {
        var mount = document.getElementById("grid");
        if (!dimension || isNaN(dimension) || !parseInt(dimension, 10)) {
            return false;
        } else {
            dimension = typeof dimension === 'string' ? parseInt(dimension, 10) : dimension;
            var table = document.createElement('table'),
                row = document.createElement('tr'),
                cell = document.createElement('td'),
                rowClone,
                cellClone;
            var output;
            for (var r = 0; r < dimension; r++) {
                rowClone = row.cloneNode(true);
                table.appendChild(rowClone);
                for (var c = 0; c < dimension; c++) {
                    cellClone = cell.cloneNode(true);
                    rowClone.appendChild(cellClone);
                }
            }
            table.id = "gameTable";
            mount.appendChild(table);
            output = gameBoard.enumerateBoard(table);
        }
        return output;
    },
    enumerateBoard: function(board) {
        var rows = board.getElementsByTagName('tr'),
            text = document.createTextNode(''),
            rowCounter = 1,
            size = rows.length,
            cells,
            cellsLength,
            cellNumber,
            odd = false,
            control = 0;
        for (var r = size - 1; r >= 0; r--) {
            cells = rows[r].getElementsByTagName('td');
            cellsLength = cells.length;
            rows[r].className = r % 2 == 0 ? 'even' : 'odd';
            odd = ++control % 2 == 0 ? true : false;
            size = rows.length;
            for (var i = 0; i < cellsLength; i++) {
                if (odd == true) {
                    cellNumber = --size + rowCounter - i;
                } else {
                    cellNumber = rowCounter;
                }
                cells[i].className = i % 2 == 0 ? 'even' : 'odd';
                cells[i].id = cellNumber;
                cells[i].appendChild(text.cloneNode());
                cells[i].firstChild.nodeValue = cellNumber;
                rowCounter++;
            }
        }
        var lastRow = rows[0].getElementsByTagName('td');
        lastRow[0].id = '100';
        var firstRow = rows[9].getElementsByTagName('td');
        firstRow[0].id = '1';
        return gameBoard;
    }
};
gameBoard.createBoard(10);
var player = function() {
    var initialPosition = 1;
    var destination;
    var numberOfThrows = 0;
    var numberOfTimesSix = 0;
    var numberOfLadders = 0;
    var numberOfSnakes = 0;

    return {
        setInitialPosition: function(id) {
            $("#1").append($(id));
            destination = 1;
        },
        move: function(id, randomdice) {
            numberOfThrows++;
            if (randomdice === 6) {
                numberOfTimesSix++;
            }
            var x = parseInt($('#' + destination).attr('id'));
            destination = x + randomdice;
            if (destination === 12) {
                destination = 31;
                numberOfLadders++;
            } else if (destination === 96) {
                destination = 57;
                numberOfSnakes++;
            }
            if (destination <= 100) {
                $("#" + destination).append($(id));
            }
            if (destination === 100) {
                alert("you won the game");
            }
        },
        getReportData: function() {
            return {
                numberOfThrows: numberOfThrows,
                numberOfTimesSix: numberOfTimesSix,
                numberOfLadders: numberOfLadders,
                numberOfSnakes: numberOfSnakes
            }
        }
    }
}

var player1 = player();
player1.setInitialPosition("#player1");

var player2 = player();
player2.setInitialPosition("#player2");

var turnNumber = 1;

var face1 = new Image()
face1.src = "http://s19.postimg.org/fa5etrfy7/image.gif"
var face2 = new Image()
face2.src = "http://s19.postimg.org/qb0jys873/image.gif"
var face3 = new Image()
face3.src = "http://s19.postimg.org/fpgoms1vj/image.gif"
var face4 = new Image()
face4.src = "http://s19.postimg.org/xgsb18ha7/image.gif"
var face5 = new Image()
face5.src = "http://s19.postimg.org/lsy96os5b/image.gif"
var face6 = new Image()
face6.src = "http://s19.postimg.org/4gxwl8ynz/image.gif"

var numberOfSixes = 0;

function rollDice() {
    var randomdice = Math.floor(Math.random() * 6) + 1;
    document.images["mydice"].src = eval("face" + randomdice + ".src");
    var isSix = false;
    if (randomdice === 6) {
        alert('Congratulations! You got 6! Roll the dice again');
        isSix = true;
        numberOfSixes++;
    }
    if (turnNumber === 1) {
        player1.move("#player1", randomdice);
        turnNumber = isSix && numberOfSixes <= 2 ? 1 : 2;
    } else {
        player2.move("#player2", randomdice);
        turnNumber = isSix && numberOfSixes <= 2 ? 2 : 1;
    }
    numberOfSixes = numberOfSixes > 2 ? 0 : numberOfSixes;
    $("#reportTable > tbody").html("");
    $("#reportTable").css("display", "none");
}

function generateReport() {
    var object = [];
    object.push(player1.getReportData());
    object.push(player2.getReportData());
    var tbody = $("#reportTable > tbody");
    $("#reportTable > tbody").html("");
    $.each(object, function(index, data) {
        var tr = $("<tr></tr>");
        tr.append($("<td>", {
            'text': data.numberOfThrows
        }));
        tr.append($("<td>", {
            'text': data.numberOfTimesSix
        }));
        tr.append($("<td>", {
            'text': data.numberOfLadders
        }));
        tr.append($("<td>", {
            'text': data.numberOfSnakes
        }));
        tbody.append(tr);
    });
    $("#reportTable").css("display", "block");
}