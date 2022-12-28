//-----------Create HTML--------------
const mainDiv = document.querySelector(`.gamefield`) as HTMLDivElement;
const btnStart = document.createElement(`button`);
btnStart.className = `startButton`;
btnStart.innerHTML = `Start game`;
mainDiv.appendChild(btnStart);

const createFiveBalloons = () => {
  let i: number = 0;

  while (i <= 4) {
    let divContainer = document.createElement(`div`);
    divContainer.className = `bubble_Container`;
    let divBubble = document.createElement(`div`);
    divBubble.className = `bubble`;
    divContainer.appendChild(divBubble);
    mainDiv.appendChild(divContainer);
    i++;
  }
}
createFiveBalloons();

//-------------Declare variables--------------- 
let totalBalloons: number = 0;
let gameStarted: boolean = false;
let topScore: any;
let points: number = 0;

const bubbleContainers = document.getElementsByClassName(`bubble_Container`) as HTMLCollectionOf<HTMLDivElement>;
const bubbles = document.getElementsByClassName(`bubble`) as HTMLCollectionOf<HTMLDivElement>;
const scoreBoard = document.getElementById(`currentScoreView`) as HTMLSpanElement;
const bestScore = document.getElementById(`topScoreView`) as HTMLSpanElement;
const startButton = document.querySelector(`.startButton`) as HTMLButtonElement;
const gameBoard = document.querySelector(`.gameboard`) as HTMLSpanElement;

//-------- Audio mp3--------------------
const ballShot: HTMLAudioElement = new Audio(`../../public/MP3/popballoon1.mp3`);
const backgroundMusic: HTMLAudioElement = new Audio(`../../public/MP3/ce8e6287c767e45.mp3`);

topScore = loadTopScore();

Array.from(bubbles).forEach(bubble => bubble.addEventListener(`click`, handleClickOnBalloons));

//-------- Start the game--------------------
const startGame = () => {
  playMusic(backgroundMusic, `play`)
//  console.log(backgroundMusic)
//    backgroundMusic.play()
  points = 0;
  updateScoreBoard(points.toString());
  startButton.style.display = `none`;
  gameStarted = true;
  ballonCounting();
}
startButton.addEventListener(`click`, startGame);

updateScoreBoard(points.toString());

const generateRandomNumber = (from: number, to: number) => {
  return Math.floor((to - from + 1) * Math.random()) + from;
};

const showRandomBalloon = (arrBalloons: any) => {
  const balloonNumber = arrBalloons[generateRandomNumber(0, arrBalloons.length - 1)];
  return balloonNumber;
}

function loadTopScore() {
  if (!localStorage) return 0;
  const score = localStorage.getItem(`topScore`);
  return score ? score : 0;
}

const saveTopScore = (score: string) => {
  if (!localStorage) return;
  localStorage.setItem(`topScore`, score);
}

const raiseUpBalloon = (bubbleContainer: HTMLDivElement) => {
  bubbleContainer.classList.remove(`boom`);
  bubbleContainer.classList.add(`up`);
}

const hideBalloon = (bubbleContainer: HTMLDivElement) => {
  bubbleContainer.classList.remove(`up`);
}

function updateScoreBoard(points: string) {
  scoreBoard.textContent = `Points: ` + points;
  bestScore.dataset.points = topScore;
}

function handleClickOnBalloons(e: any) {
  const bubbleContainer = e.target.parentElement;
  bubbleContainer.classList.add(`boom`);
  bubbleContainer.classList.add(`up`);
  setTimeout(() => {
    hideBalloon(bubbleContainer);   
    playMusic(ballShot, `play`)
    points++;

    updateScoreBoard(points.toString())
  }, 50); 
   playMusic(ballShot, `load`)
}

function raiseNextBalloonUp() {
  const bubbleContainer = showRandomBalloon(bubbleContainers);
  raiseUpBalloon(bubbleContainer);
  bubbleContainer.timeout = setTimeout(() => {
    hideBalloon(bubbleContainer);
  },
    generateRandomNumber(4000, 5000)//(4000, 5000)//(800, 2500)
  );
}

function ballonCounting() {
  setTimeout(() => {    
    manageGame()
    totalBalloons++   
    gameBoard.textContent = `Balloon number: ${totalBalloons.toString()}`;
  }, generateRandomNumber(2500, 3500)//(1000, 1000)//(500, 2500)
  );
}

function manageGame() {
  if (gameStarted && totalBalloons <= 19) {
    if (totalBalloons - points == 3) {
      setTimeout(() => {
        alert(`You have missed 3 balloons. The game is over.`)
        finishGame(false, false);      
        playMusic(backgroundMusic, `load`);
      }
        , 1000);
      return;
    }
    else {
      raiseNextBalloonUp();
      ballonCounting();
    }
  }
  else {
    finishGame(true, true)
    playMusic(backgroundMusic, `load`)
  }
}

const finishGame = (saveTopScoreYN: boolean, gameWon: boolean) => {
  startButton.style.display = `initial`;
  topScore = Math.max(points, topScore);
  Array.from(bubbleContainers).forEach((bubble) => {
    bubble.classList.remove(`up`)
  }
  );

  if (!saveTopScoreYN) {
    saveTopScore(topScore);
  }

  // if (!gameWon) {
    updateScoreBoard(points.toString());
  //  }
   
   totalBalloons == 0;
   gameBoard.textContent = `Balloon number: 0`;
 }

function playMusic(audioElelemnt: HTMLAudioElement, action: string){
  if (action == `play`) {   
    audioElelemnt.play();
  }
  if (action ==`load`) {
    //---Reload the Music (back to the start)---
    audioElelemnt.load();
  }
}



