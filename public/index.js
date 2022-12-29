"use strict";
//-----------Create HTML--------------
const mainDiv = document.querySelector(`.gamefield`);
const btnStart = document.createElement(`button`);
btnStart.className = `startButton`;
btnStart.innerHTML = `Start game`;
mainDiv.appendChild(btnStart);
const createFiveBalloons = () => {
    let i = 0;
    while (i <= 4) {
        let divContainer = document.createElement(`div`);
        divContainer.className = `bubble_Container`;
        let divBubble = document.createElement(`div`);
        divBubble.className = `bubble`;
        divContainer.appendChild(divBubble);
        mainDiv.appendChild(divContainer);
        i++;
    }
};
createFiveBalloons();
//-------------Declare variables--------------- 
let totalBalloons = 0;
let gameStarted = false;
let topScore;
let points = 0;
const bubbleContainers = document.getElementsByClassName(`bubble_Container`);
const bubbles = document.getElementsByClassName(`bubble`);
const scoreBoard = document.getElementById(`currentScoreView`);
const bestScore = document.getElementById(`topScoreView`);
const startButton = document.querySelector(`.startButton`);
const gameBoard = document.querySelector(`.gameboard`);
//-------- Audio mp3--------------------
const ballShot = new Audio(`../../public/MP3/popballoon1.mp3`);
const backgroundMusic = new Audio(`../../public/MP3/ce8e6287c767e45.mp3`);
topScore = loadTopScore();
Array.from(bubbles).forEach(bubble => bubble.addEventListener(`click`, handleClickOnBalloons));
//-------- Start the game--------------------
const startGame = () => {
    playMusic(backgroundMusic, `play`);
    points = 0;
    updateScoreBoard(points.toString());
    startButton.style.display = `none`;
    gameStarted = true;
    ballonCounting();
};
startButton.addEventListener(`click`, startGame);
updateScoreBoard(points.toString());
const generateRandomNumber = (from, to) => {
    return Math.floor((to - from + 1) * Math.random()) + from;
};
const showRandomBalloon = (arrBalloons) => {
    const balloonNumber = arrBalloons[generateRandomNumber(0, arrBalloons.length - 1)];
    return balloonNumber;
};
function loadTopScore() {
    if (!localStorage)
        return 0;
    const score = localStorage.getItem(`topScore`);
    return score ? score : 0;
}
const saveTopScore = (score) => {
    if (!localStorage)
        return;
    localStorage.setItem(`topScore`, score);
};
const raiseUpBalloon = (bubbleContainer) => {
    bubbleContainer.classList.remove(`boom`);
    bubbleContainer.classList.add(`up`);
};
const hideBalloon = (bubbleContainer) => {
    bubbleContainer.classList.remove(`up`);
};
function updateScoreBoard(points) {
    scoreBoard.textContent = `Points: ${points}`;
    bestScore.dataset.points = topScore;
}
function handleClickOnBalloons(e) {
    const bubbleContainer = e.target.parentElement;
    bubbleContainer.classList.add(`boom`);
    bubbleContainer.classList.add(`up`);
    setTimeout(() => {
        hideBalloon(bubbleContainer);
        playMusic(ballShot, `play`);
        points++;
        updateScoreBoard(points.toString());
    }, 50);
    playMusic(ballShot, `load`);
}
function raiseNextBalloonUp() {
    const bubbleContainer = showRandomBalloon(bubbleContainers);
    raiseUpBalloon(bubbleContainer);
    bubbleContainer.timeout = setTimeout(() => {
        hideBalloon(bubbleContainer);
    }, generateRandomNumber(4000, 5000) //(800, 2500)
    );
}
function ballonCounting() {
    setTimeout(() => {
        manageGame();
        totalBalloons++;
        gameBoard.textContent = `Balloon number: ${totalBalloons.toString()}`;
    }, generateRandomNumber(2500, 3500) //(500, 2500)
    );
}
function manageGame() {
    if (gameStarted && totalBalloons <= 19) {
        if (totalBalloons - points == 3) {
            setTimeout(() => {
                alert(`You have missed 3 balloons. The game is over.`);
                finishGame(true);
                playMusic(backgroundMusic, `load`);
            }, 1000);
            return;
        }
        else {
            raiseNextBalloonUp();
            ballonCounting();
        }
    }
    else {
        finishGame(true);
        playMusic(backgroundMusic, `load`);
    }
}
const finishGame = (saveTopScoreYN) => {
    startButton.style.display = `initial`;
    topScore = Math.max(points, topScore);
    Array.from(bubbleContainers).forEach((bubble) => {
        bubble.classList.remove(`up`);
    });
    if (!saveTopScoreYN) {
        saveTopScore(topScore);
    }
    updateScoreBoard(points.toString());
    totalBalloons = 0;
    gameBoard.textContent = `Balloon number: ${totalBalloons}`;
};
function playMusic(audioElelemnt, action) {
    if (action == `play`) {
        audioElelemnt.play();
    }
    if (action == `load`) {
        //---Reload the Music (back to the start)---
        audioElelemnt.load();
    }
}
