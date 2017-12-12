//console.log("hello");
$(document).ready(function() {
    $.get("crazy.json", function(data) {
    console.log(data.crazy);
    var crazy=atob(data.crazy);

    // Initialize Firebase
    var config = {
        apiKey: crazy,
        authDomain: "my-project-1493235363765.firebaseapp.com",
        databaseURL: "https://my-project-1493235363765.firebaseio.com",
        projectId: "my-project-1493235363765",
        storageBucket: "my-project-1493235363765.appspot.com",
        messagingSenderId: "893731391847"
    };



    firebase.initializeApp(config);

    //console.log(firebase.initializeApp(config));

    var database = firebase.database();

    //player assignment

    var player = 0;
    var player1;
    var player2;
    var player1_user_key;
    var player2_user_key;
    var player1_selection;
    var player2_selection;
    var usernameInput;
    var user_key;
    var win;
    var loss;
    var game_control_flag = 'N';
    var game_control_flag1 = 'N';
    var player;

    ///////////////////////////////////CREATE PLAYER////////////////////////////////////////////////////
    $("#create_player").on("click", function() {
        event.preventDefault();

        //localStorage.lastname = "Smith";

        usernameInput = document.querySelector('#username').value;

        localStorage.setItem("username", usernameInput);

        database.ref("/user").on("value", function(snapshot) {



            function check_if_user_exists(snapshot) {
                for (var key in snapshot.val()) {

                    console.log(snapshot.child(key).val().username);

                    if (snapshot.child(key).val().username === usernameInput) return true


                }
                return false


            }

            if (check_if_user_exists(snapshot)) {

                for (var key in snapshot.val()) {

                    //console.log(snapshot.child(key).val().username)  ; 

                    if (snapshot.child(key).val().username === usernameInput) {
                        user_key = key;
                    }
                }
            } else {

                database.ref("/user").push({
                    username: usernameInput,
                    win: 0,
                    loss: 0,
                    player: 0
                });

            }



        });

    });


    ///////////////////////////////////INITATE PLAYERS////////////////////////////////////////////////////




    $("#start").on("click", function() {


        console.log(game_control_flag);

        game_control_flag = 'Y';
        game_control_flag1 = 'Y';


        $("#win_loss_messege").html("");

        database.ref("/assignment").on("value", function(snapshot) {

            if (snapshot.val().player1 === "player1" && game_control_flag === 'Y' && game_control_flag1 === 'Y') {
                // player = 1;
                database.ref("/assignment").update({
                    player1: user_key

                });
                console.log(snapshot.player1);

                database.ref("/user").on("value", function(snapshot) {

                    console.log(snapshot.child(user_key).val().username);

                    player1 = snapshot.child(user_key).val().username;
                    player1_user_key = user_key;
                    player = 1;

                });

                $("#player_message").html(player1 + " you are Player 1");
                //player1=usernameInput.value;
                $("#game_message").html("Please select rock, paper or scissors");
                console.log("user_key:" + user_key);
            }

            if (snapshot.val().player2 === "player2" && snapshot.val().player1 != "player1" && snapshot.val().player1 != user_key && game_control_flag === 'Y') {
                // player = 2;

                database.ref("/assignment").update({
                    player2: user_key

                });

                database.ref("/user").on("value", function(snapshot) {

                    player2 = snapshot.child(user_key).val().username;
                    player2_user_key = user_key;
                    player = 2;


                });

                $("#player_message").html(player2 + " you are Player 2");
                //player1=usernameInput.value;
                $("#game_message").html("Please select rock, paper or scissors");

            }




        });



    });


    ///////////////////////////////////HANDLE SELECTIONS////////////////////////////////////////////////////

    $("#choices").on("click", ".choices", function() {

        //console.log(player1_user_key);
        //console.log(player2_user_key);

        var letter = this.id;

        //console.log(letter);



        //console.log(letter);

        if (player1_user_key === user_key && game_control_flag === 'Y') {

            //player1_selection=letter;

            database.ref("/player1").set({
                username: player1,
                selection: letter
            });

            // database.ref("/player1").on("value", function(snapshot) {
            //   player1_selection = snapshot.val().selection;
            // / console.log("hello:"+ player1_selection);
            // }, function(error) {
            //   console.log("Error: " + error.code);
            // });
            check_for_answers();

        }

        if (player2_user_key === user_key && game_control_flag === 'Y') {


            database.ref("/player2").set({
                username: player2,
                selection: letter
            });

            check_for_answers();


        }





    });


    ///////////////////////////////////CHECK ANSWERS//////////////////////////////////////////////////

    function check_for_answers() {


        var ref = firebase.database().ref("/player1");

        ref.on("value", function(snapshot) {
            player1_selection = snapshot.val().selection;
            //console.log(player2_selection);
            console.log("hello:" + player1_selection);

            win_loss();

        }, function(error) {
            console.log("Error: " + error.code);
        });

        var ref = firebase.database().ref("/player2");

        ref.on("value", function(snapshot) {
            player2_selection = snapshot.val().selection;
            console.log("hello:" + player2_selection);
            win_loss();

        }, function(error) {
            console.log("Error: " + error.code);
        });

        //if (player1_selection && player2_selection) {
        //win_loss(player1_selection, player2_selection);
        //  console.log ("im here");
        //};



    }

    ///////////////////////////////////GAME LOGIC////////////////////////////////////////////////////

    function win_loss() {

        if (player1_selection && player2_selection && game_control_flag === 'Y') {
            if (player1_selection === player2_selection) {

                $("#win_loss_messege").html("draw");



                console.log("im here8");


                reset_game();


            } else if (player1_selection === "s" && player2_selection === "p") {
                console.log("player1 wins");
                $("#win_loss_messege").html("player1 wins");



                console.log("im here9");
                //score_win_loss(1);

                reset_game();


            } else if (player1_selection === "p" && player2_selection === "r") {
                $("#win_loss_messege").html("player1 wins");
                console.log("player1 wins");

                console.log("im here10");
              //  score_win_loss(1);

                reset_game();


            } else if (player1_selection === "r" && player2_selection === "s") {
                $("#win_loss_messege").html("player1 wins");
                console.log("player1 wins");


                console.log("im here11");
               // score_win_loss(1);

                reset_game();

            } else if (player2_selection === "s" && player1_selection === "p") {
                $("#win_loss_messege").html("player2 wins");
                console.log("player2 wins");


                console.log("im here12");
               // score_win_loss(2);

                reset_game();


            } else if (player2_selection === "p" && player1_selection === "r") {

                $("#win_loss_messege").html("player2 wins");
                console.log("player2 wins");

                console.log("im here13");
                //score_win_loss(2);

                reset_game();



            } else if (player2_selection === "r" && player1_selection === "s") {
                $("#win_loss_messege").html("player2 wins");
                console.log("player2 wins");
                //score_win_loss(2);

                reset_game();
                console.log("im here14");


            }

        }




    };

/*
    function score_win_loss(winner) {

       if (winner===1 && player1_user_key) {

        database.ref("/user").on("value", function(snapshot) {

            var wins = snapshot.child(player1_user_key).val().win;
            wins++;
            console.log(wins);
        });


        snapshot.child(player1_user_key).update({
                win: wins
            });
    

    }

    if (winner===2 && player2_user_key ) {

        database.ref("/user").on("value", function(snapshot) {

            var wins = snapshot.child(player2_user_key).val().win;
            wins++;
            console.log(wins);

          snapshot.child(player2_user_key).update({
                win: wins
            });
        });
    

    }




    }
    */



    ///////////////////////////////////RESET////////////////////////////////////////////////////


    function reset_game() {
        database.ref("/assignment").set({
            player1: "player1",
            player2: "player2"
        });


        database.ref("/player1").set({
            username: "",
            selection: ""

        });

        database.ref("/player2").set({
            username: "",
            selection: ""

        });

        game_control_flag = 'N';
        game_control_flag1 = 'N';

        console.log(player1_user_key);





        $("#start").off();




    }




    ///////////////////////////////////CHAT////////////////////////////////////////////////////


    var usernameInput = localStorage.getItem("username");
    var textInput = document.querySelector('#text');
    var postButton = document.querySelector('#post');

    postButton.addEventListener("click", function() {

        var msgUser = usernameInput;
        var msgText = textInput.value;
        firebase.database().ref("/chat").set(msgUser + " says: " + msgText);
        firebase.database().ref("/chat").push({
            username: msgUser,
            text: msgText
        });

        textInput.value = "";
    });




    var startListening = function() {
        firebase.database().ref("/chat").on('child_added', function(snapshot) {
            var msg = snapshot.val();

            var msgUsernameElement = document.createElement("b");
            msgUsernameElement.textContent = msg.username;

            var msgTextElement = document.createElement("p");
            msgTextElement.textContent = msg.text;

            var msgElement = document.createElement("div");
            msgElement.appendChild(msgUsernameElement);
            msgElement.appendChild(msgTextElement);

            document.getElementById("results").appendChild(msgElement);
        });
    }

    startListening();

    });

});