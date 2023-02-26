$(function(){
    // player variables
    var playerBoard = [];
    var playerShips = [];

    // computer variables
    var compBoard = [];
    var compGuessBoard = [];
    var compShips = [];
    initialize();

    // makes the battleships and places them on the board
    function Ship(name, length, board){
        // location, sunk squares, entire ship sunk, name, length
        this.name = name;
        this.length = length;
        this.sunk = false;
        this.squares = [];
        this.board = board;

        // place the ship on the board
        this.place = function(){
            var placed = false;
            // randomize if the ship will be vertical or horizontal
            var vertical = Math.round(Math.random()) == 0;
            while (!placed){
                // place it vertically
                if (vertical){
                    var c = Math.floor(Math.random()*this.board.length)
                    var r = Math.floor(Math.random()*(this.board.length-this.length))
                    for (var i = 0; i < this.length; i++){
                        this.squares.push([r+i, c]);
                        // check if this ship is colliding with another ship
                        if (this.board[r+i][c] == "S"){
                            // if so, break and try again
                            this.squares = [];
                            break;
                        }
                    }
                }
                // place it horizontally
                else {
                    var c = Math.floor(Math.random()*(this.board.length-this.length))
                    var r = Math.floor(Math.random()*this.board.length)
                    for (var i = 0; i < this.length; i++){
                        this.squares.push([r, c+i]);
                        // check if this ship is colliding with another ship
                        if (this.board[r][c+i] == "S"){
                            // if so, break and try again
                            this.squares = [];
                            break;
                        }
                    }
                }

                // check if the ship was placed
                if (this.squares.length == this.length){
                    placed = true;
                    // loop through the ship squares, and place a ship at each individual coordinate
                    for (var i = 0; i < this.squares.length; i++){
                        var r = this.squares[i][0];
                        var c = this.squares[i][1];
                        // S = ship
                        this.board[r][c] = "S";
                    }
                }
            }
        }

        this.checkSunk = function(){
            for (var i = 0; i < this.squares.length; i++){
                var r = this.squares[i][0];
                var c = this.squares[i][1];
                // S = ship
                if(this.board[r][c] == "S"){
                    return false;
                }
            }
            this.sunk = true;
            return true;
        }

        this.place();
    }

    // check every square in the board, and change the colors
    function drawBoard(board, player){
        for (var i = 0; i < board.length; i++){
            for (var j = 0; j < board.length; j++){
                var color = "#62bbd1";
                // if it's the player's board, change the squares with an S to gray
                if (board[i][j] == "S" && player == "p"){
                    color = "gray";
                }
                // change the squares with an H to red
                if (board[i][j] == "H"){
                    color = "red";
                }
                // change the squares with an M to red
                if (board[i][j] == "M"){
                    color = "yellow";
                }
                // set the background color of the grid square
                $("#" + player + "_" + i + "_" + j).css("background-color", color);
            }
        }
    }

    function compTurn(){
        // decide which square to pick
        
        // Future AI rules:
        // start with squares in the middle of the board
        // only pick even/odd squares (like a checkerboard)
        // if I hit a ship, prioritize adjacent squares
        var c = 0;
        var r = 0;
        while(compGuessBoard[r][c] !== "W"){
            c = Math.floor(Math.random()*compGuessBoard.length);
            r = Math.floor(Math.random()*compGuessBoard.length);
        }

        // check if that square is a hit or a miss
        if(playerBoard[r][c] == "S"){
            // if so, mark it as hit
            playerBoard[r][c] = "H";
            compGuessBoard[r][c] = "H";
            $("#ptext").html("Hit!")
        }
        else{
            // otherwise, mark it as a miss
            playerBoard[r][c] = "M";
            compGuessBoard[r][c] = "M";
            $("#ptext").html("Miss!")
        }

        // draw the player's board
        drawBoard(playerBoard, "p");
    }

    // check if we've won yet
    function checkWon(){
        for(var i = 0; i < compShips.length; i++){
            if(!compShips[i].sunk){
                if(!compShips[i].checkSunk()){
                    return false;
                }
            }
        }
        return true;
    }

    // main game function
    function initialize(){
        playerBoard = [];
        playerShips = [];
        compBoard = [];
        compGuessBoard = [];
        compShips = [];

        // generate the HTML for the player and computer grids
        for (var i = 0; i < 10; i++){
            var row = [];
            for (var j = 0; j < 10; j++){
                row.push("W");
                // set the grid square's id to the board, row, and column
                var id = i + "_" + j
                $("#player").append("<div id='p_" + id + "' class='gridsquare'></div>");
                $("#computer").append("<div id='e_" + id + "' class='gridsquare'></div>");
            }
            playerBoard.push(row);
            compBoard.push(row.slice());
            compGuessBoard.push(row.slice());
        }

        // place ships for the player and computer
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

        // render the ships on the player's board
        drawBoard(playerBoard, "p");

        // checking if the player clicks the computer's board
        $("#computer > .gridsquare").click(function(){
            // BEGIN PLAYER TURN
            // get the row and column of the square
            var id = $(this).attr("id").split("_");
            console.log(id)

            var r = parseInt(id[1])
            var c = parseInt(id[2])
            // check if it's been hit before
            if(compBoard[r][c] == "H" || compBoard[r][c] == "M"){
                return;
            }
            // if not, check if there's a ship there
            if(compBoard[r][c] == "S"){
                // if so, mark it as hit
                compBoard[r][c] = "H";
                $("#ctext").html("Hit!")
            }
            else{
                // otherwise, mark it as a miss
                compBoard[r][c] = "M";
                $("#ctext").html("Miss!")
            }
            drawBoard(compBoard, "e");
            // check if a ship has been sunk
            // update the text
            // END PLAYER TURN

            // check if we've won the game

            if(checkWon()){
                $("#main-text").html("You win!")
            }

            compTurn();

            // check if we've lost the game
        })
    }
});