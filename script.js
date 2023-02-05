$(function(){
    var playerBoard = [];
    var playerShips = [];

    var compBoard = [];
    var compGuessBoard = [];
    var compShips = [];
    initialize();

    function Ship(name, length, board){
        // location, sunk squares, entire ship sunk, name, length
        this.name = name;
        this.length = length;
        this.squares = [];
        this.board = board;

        this.place = function(){
            var placed = false;
            var vertical = Math.round(Math.random()) == 0;
            while (!placed){
                if (vertical){
                    var c = Math.floor(Math.random()*this.board.length)
                    var r = Math.floor(Math.random()*(this.board.length-this.length))
                    for (var i = 0; i < this.length; i++){
                        this.squares.push([r+i, c]);
                        if (this.board[r+i][c] == "S"){
                            this.squares = [];
                            break;
                        }
                    }
                }
                else {
                    var c = Math.floor(Math.random()*(this.board.length-this.length))
                    var r = Math.floor(Math.random()*this.board.length)
                    for (var i = 0; i < this.length; i++){
                        this.squares.push([r, c+i]);
                        if (this.board[r][c+i] == "S"){
                            this.squares = [];
                            break;
                        }
                    }
                }

                if (this.squares.length == this.length){
                    placed = true;
                    for (var i = 0; i < this.squares.length; i++){
                        var r = this.squares[i][0];
                        var c = this.squares[i][1];
                        this.board[r][c] = "S";
                    }
                }
            }
        }

        this.place();
    }

    function drawBoard(board, player){
        for (var i = 0; i < board.length; i++){
            for (var j = 0; j < board.length; j++){
                var color = "#62bbd1";
                if (board[i][j] == "S" && player == "p"){
                    color = "gray";
                }
                $("#p"+i+"_"+j).css("background-color", color);
            }
        }
    }

    function initialize(){
        playerBoard = [];
        playerShips = [];
        compBoard = [];
        compGuessBoard = [];
        compShips = [];
        for (var i = 0; i < 10; i++){
            var row = [];
            for (var j = 0; j < 10; j++){
                row.push("W");
                var id = i + "_" + j
                $("#player").append("<div id='p" + id + "' class='gridsquare'></div>");
                $("#computer").append("<div id='e" + id + "' class='gridsquare'></div>");
            }
            playerBoard.push(row);
            compBoard.push(row.slice());
            compGuessBoard.push(row.slice());
        }

        playerShips.push(new Ship("Carrier", 5, playerBoard));
        playerShips.push(new Ship("Battleship", 4, playerBoard));
        playerShips.push(new Ship("Cruiser", 3, playerBoard));
        playerShips.push(new Ship("Submarine", 3, playerBoard));
        playerShips.push(new Ship("Destroyer", 2, playerBoard));

        compShips.push(new Ship("Carrier", 5, compBoard));
        compShips.push(new Ship("Battleship", 4, compBoard));
        compShips.push(new Ship("Cruiser", 3, compBoard));
        compShips.push(new Ship("Submarine", 3, compBoard));
        compShips.push(new Ship("Destroyer", 2, compBoard));

        drawBoard(playerBoard, "p");

        $("#computer > .gridsquare").click(function(){
            // get the row and column of the square
            // check if it's been hit before
            // if not, check if there's a ship there
                // if so, mark it as hit
                // otherwise, mark it as a miss
            // update the text
            console.log("clicked gridsquare!")
        })
    }
});