$(document).ready(function(){
    var chatBox = document.getElementById('typingBox');
    chatBox.style.visibility = "hidden";

    var timeLabel = document.getElementById('time');
    var ffLabel = document.getElementById('ff');
    var ffPerSecondLabel = document.getElementById('ffPerSecond');
    var highestPerSecondLabel = document.getElementById('highestPerSecond');
    var resetHighScoreButton = document.getElementById('resetHighScoreButton');
    resetHighScoreButton.style.visibility = "hidden";

    var time = 0;
    var amountOfFFs = 0;
    var started = false;
    var timeLoop;
    var averageLoop;
    var average = 0;
    var highestPerSecond = parseFloat(localStorage.getItem('highScore')).toFixed(2) || 0;
    if (isNaN(highestPerSecond)){
        highestPerSecond = 0;
    } else {
        highestPerSecond = parseFloat(highestPerSecond);
        resetHighScoreButton.style.visibility = "visible";
    }
    highestPerSecondLabel.innerHTML = "<b>Highest FFs per second: </b>" + highestPerSecond.toFixed(2);

    function TimerIncrease() {
        time += 1;
        timeLabel.innerHTML = "<b>Time: </b>" + time;
    }

    document.body.addEventListener("keydown", function (event) {
        if (event.keyCode == 13){

            if (chatBox.style.visibility == "visible"){
                if (chatBox.value.toLowerCase() == "/ff"){
                    if (!started){
                        timeLoop = setInterval(TimerIncrease, 10);
                        averageLoop = setInterval(AverageCalc, 100);
                        started = true;
                    } else {
                        amountOfFFs += 1;
                        ffLabel.innerHTML = "<b>FFs: </b>" + amountOfFFs; 
                    }
                }
                chatBox.value = "";
            } 
            chatBox.style.visibility = (chatBox.style.visibility == "hidden") ? "visible" : "hidden";
            chatBox.focus();
        }
    });

    function AverageCalc(){
        if (amountOfFFs > 2){
            average = amountOfFFs / (time / 100);
            ffPerSecondLabel.innerHTML = "<b>FFs per second: </b>" + average.toFixed(2);
            if (average > highestPerSecond) {
                highestPerSecond = average;
                localStorage.setItem("highScore", highestPerSecond);
                if (resetHighScoreButton.style.visibility == "hidden")
                    resetHighScoreButton.style.visibility = "visible";
                highestPerSecondLabel.innerHTML =
                    "<b>Highest FFs per second: </b>" + highestPerSecond.toFixed(2); 
            }
        }
    }

    document.getElementById('resetButton').addEventListener("click", function() {
        time = 0;
        amountOfFFs = 0;
        started = false;
        average = 0;   
        clearInterval(timeLoop);
        clearInterval(averageLoop);

        timeLabel.innerHTML = "<b>Time: </b>";
        ffLabel.innerHTML = "<b>FFs: </b>";
        ffPerSecondLabel.innerHTML = "<b>FFs per second: <b/>";
    });

    resetHighScoreButton.addEventListener("click", function () {
        highestPerSecond = 0;
        localStorage.setItem('highScore', 0);
        highestPerSecondLabel.innerHTML =
        "<b>Highest FFs per second: </b> 0";
    });
});



