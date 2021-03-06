var initialTime = 3000;
var time = initialTime;
var amountOfFFs = 0;
var started = false;
var timeLoop;
var average = 0;
var timeToRecordFFTime = 0;
var fastestFFTypeSpeed = 20;
var typingTimingLoop;
var tiltAmount = 0;
var canRestart = false;

var buttonNewTime10;
var buttonNewTime30;
var buttonNewTime60;
var buttonNewTimeInfinite;
var buttons = [];

var chatBox;
var timeLabel;
var ffLabel;
var ffPerSecondLabel;
var highestPerSecondLabel;
var resetHighScoreButton;
var highestPerSecond;
var tiltScoreLabel;
var tiltStringLabel;

var currentFFTypeSpeedLabel;
var highestFFTypeSpeedLabel;


function ResetVariables(){
    time = initialTime;
    amountOfFFs = 0;
    started = false;
    average = 0;

    timeLabel.innerHTML = time;
    ffLabel.innerHTML = 0;
    ffPerSecondLabel.innerHTML = 0;
    fastestFFTypeSpeed = 20;
}

function GiveNewTime(button, newTime){
    for (let index = 0; index < buttons.length; index++) {
        const element = buttons[index];
        if (button == element){
            button.disabled = true;
        } else {
            element.disabled = false;
        }
    }
    initialTime = newTime;
    ResetVariables();
    clearInterval(timeLoop);
    GetHighscore();
    clearInterval(typingTimingLoop);
    typingTimingLoop = null;
}

function GetHighscore(){
    highestPerSecond = parseFloat(localStorage.getItem('highScore'+initialTime)).toFixed(2) || 0;
    if (isNaN(highestPerSecond)){
        highestPerSecond = 0;
        resetHighScoreButton.disabled = true;
    } else {
        highestPerSecond = parseFloat(highestPerSecond);
        if (highestPerSecond > 0)
            resetHighScoreButton.disabled = false;
        else
            resetHighScoreButton.disabled = true;
    }
    highestPerSecondLabel.innerHTML = highestPerSecond.toFixed(2);
}

$(document).ready(function(){
    var rageQuotes = [
        "GANK MY LANE FFS",
        "enjoy 4v5 lol",
        "gg go next",
        "lets ff 15 :)",
        "wow nice laning xD",
        "first time lee sin haha",
        "ah :P thought you had him there!",
        "is it your first time?? lol..",
        "open mid!! push it",
        "lol wtf are you doing XDDD",
        "RIGHT THROUGH THE COUNTERSTRIKE",
        "unstoppable btw",
        "I WAS IN ALPHA",
        "hardstuck Diamond",
        "riven 1 trick, can't jungle",
        "lol autofilled jungle",
        "if i die again im afk btw",
        "im done",
        "?",
        "open mid",
        "An ally has been slain",
        "I lost lane now i take jung",
        "ggez",
        "ur useless",
        "im getting camped do something",
        "its just a game lol",
        "idc",
        "Jungle difference XD"
    ];

    var tiltValues = [
        5,
        10,
        20,
        30,
        40,
        50
    ];

    var tiltStrings = [
        "not at all",
        "a tiny bit",
        "a little",
        "quite",
        "very",
        "extremely"
    ];

    chatBox = document.getElementById('typingBox');
    chatBox.onpaste = function(e) {
        e.preventDefault();
    }
    chatBox.style.visibility = "hidden";

    timeLabel = document.getElementById('time');
    ffLabel = document.getElementById('ffCount');
    ffPerSecondLabel = document.getElementById('ffPerSecond');
    highestPerSecondLabel = document.getElementById('highestPerSecond');
    resetHighScoreButton = document.getElementById('resetHighScoreButton');
    currentFFTypeSpeedLabel = document.getElementById('currentFFTypeSpeed');
    highestFFTypeSpeedLabel = document.getElementById('highestFFTypeSpeed');
    tiltScoreLabel = document.getElementById('tiltScore');
    tiltStringLabel = document.getElementById('tiltString');

    buttonNewTime10 = document.getElementById('btnTime10');
    buttonNewTime10.addEventListener("click", function() {GiveNewTime(this, 1000);});
    buttons.push(buttonNewTime10);

    buttonNewTime30 = document.getElementById('btnTime30');
    buttonNewTime30.addEventListener("click", function() {GiveNewTime(this, 3000);});
    buttons.push(buttonNewTime30);

    buttonNewTime60 = document.getElementById('btnTime60');
    buttonNewTime60.addEventListener("click", function() {GiveNewTime(this, 6000);});
    buttons.push(buttonNewTime60);

    buttonNewTimeInfinite = document.getElementById('btnTimeInfinite');
    buttonNewTimeInfinite.addEventListener('click', function() {GiveNewTime(this, 0);});
    buttons.push(buttonNewTimeInfinite);

    resetHighScoreButton.disabled = true;
    GetHighscore();

    function TimerChange() {
        if (initialTime > 0){
            if (time > 0){
                time -= 1;
                timeLabel.innerHTML = time;
            } else {
                AverageCalc();
                clearInterval(timeLoop);
                if (amountOfFFs > 0)
                    resetHighScoreButton.disabled = false;
            }
        } else {
            time += 1;
            timeLabel.innerHTML = time;
            AverageCalc();
        } 
    }
    
    document.body.addEventListener("keydown", function (event) {
        if (event.keyCode == 13){
            if (chatBox.style.visibility == "visible"){
                if (chatBox.value.toLowerCase() == "/ff"){
                    if (!started){
                        timeLoop = setInterval(TimerChange, 10);
                        started = true;
                        if (initialTime > 0) {
                            amountOfFFs += 1;
                            ffLabel.innerHTML = amountOfFFs; 
                        }                      
                    } else {
                        if (time > 0) {
                            amountOfFFs += 1;
                            if (Math.random() > 0.6)
                                RandomRage();
                            ffLabel.innerHTML = amountOfFFs;
                            if (canRestart)
                                canRestart = false;
                        } else if (time <= 0 && initialTime > 0 && canRestart){
                            ResetGo();
                        }
                    }
                    clearInterval(typingTimingLoop);
                    typingTimingLoop = null;
                    var current = timeToRecordFFTime / 100;
                    if (current < fastestFFTypeSpeed){
                        fastestFFTypeSpeed = current;
                        highestFFTypeSpeedLabel.innerHTML = fastestFFTypeSpeed;
                    }
                    currentFFTypeSpeedLabel.innerHTML = current;
                    timeToRecordFFTime = 0;
                }
                chatBox.value = "";
            } else {
                if (!typingTimingLoop){
                    typingTimingLoop = setInterval(FFTypeTime, 10);
                } 
            }
            chatBox.style.visibility = (chatBox.style.visibility == "hidden") ? "visible" : "hidden";
            chatBox.focus();
        }
    });

    
    function FFTypeTime(){
        timeToRecordFFTime += 1;
    }

    function AverageCalc() {
        if (initialTime > 0){
            average = amountOfFFs / (initialTime / 100);
            setTimeout(function(){canRestart = true;}, 1000);
        } else {
            average = amountOfFFs / (time / 100);
        }
        ffPerSecondLabel.innerHTML = average.toFixed(4);
        if (average > highestPerSecond) {
            highestPerSecond = average;
            localStorage.setItem("highScore"+initialTime, highestPerSecond);
            if (resetHighScoreButton.disabled == true)
                resetHighScoreButton.disabled = false;
            highestPerSecondLabel.innerHTML = highestPerSecond.toFixed(4);
        }
        TiltScoreCalc();
    }

    function TiltScoreCalc(){
        tiltAmount = ((average / fastestFFTypeSpeed) * 10).toFixed(2);
        tiltScoreLabel.innerHTML = tiltAmount;
        for (let index = 0; index < tiltValues.length; index++) {
            const element = tiltValues[index];
            if (tiltAmount < element){
                tiltStringLabel.innerHTML = "You are " + tiltStrings[index == 0 ? index : index - 1] + " tilted.";
                return;
            } 
            if (index == tiltValues.length - 1)
                tiltStringLabel.innerHTML = "You are " + tiltStrings[tiltStrings.length - 1] + " tilted.";
        }
    }

    function RandomRage(){
        $.toast({
            text: rageQuotes[Math.floor(Math.random()*rageQuotes.length)],
            allowToastClose: false,
            position: 'bottom-center',
            stack: false,
            bgColor: '#373737',
            textColor: 'white',
            textAlign: 'center',
            loader: false
        });
    }

    document.getElementById('resetButton').addEventListener("click", function() {
        ResetVariables();
        clearInterval(timeLoop);
    });

    function ResetGo(){
        ResetVariables();  
        clearInterval(timeLoop);
        timeLoop = setInterval(TimerChange, 10);
        started = true;
        if (initialTime > 0) {
            amountOfFFs += 1;
            ffLabel.innerHTML = amountOfFFs;
        }                   
    }

    resetHighScoreButton.addEventListener("click", function () {
        highestPerSecond = 0;
        localStorage.setItem('highScore'+initialTime, 0);
        highestPerSecondLabel.innerHTML = 0;
        resetHighScoreButton.disabled = true;
    });
});



