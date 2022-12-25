
//-----------Create HTML--------------
const mainDiv = document.querySelector(".gamefield") as HTMLDivElement;
const btnStart = document.createElement("button");
btnStart.className ="startButton";
btnStart.innerHTML ="Start game";
mainDiv.appendChild(btnStart);

const createFiveBalloons = () =>{
  let i: number = 0;

  while (i <= 4) {
      let divContainer = document.createElement("div");
      divContainer.className = "bubble_Container";
      let divBubble = document.createElement("div");
      divBubble.className = "bubble";
      divContainer.appendChild(divBubble);
      mainDiv.appendChild(divContainer);
      // console.dir(mainDiv);
      i++;
  }
}
createFiveBalloons();

//-------------Declare variables--------------- 
let totalBallons: number = 0;
let gameStarted: boolean;
let topScore : any; 
let points: number = 0;
let missedBalloons: number =0 

const bubbleContainers = document.getElementsByClassName("bubble_Container") as HTMLCollectionOf<HTMLDivElement> ;
const bubbles = document.getElementsByClassName("bubble") as HTMLCollectionOf<HTMLDivElement>;
const scoreBoard = document.getElementById("currentScoreView") as HTMLSpanElement;
const bestScore = document.getElementById("topScoreView")  as HTMLSpanElement;
const startButton = document.querySelector(".startButton")  as HTMLButtonElement;
const gameBoard = document.querySelector(".gameboard") as HTMLSpanElement;

//-------- Audio mp3--------------------
const ballShot: HTMLAudioElement= new Audio("../../public/MP3/popballoon1.mp3");
const bgMusic: HTMLAudioElement= new Audio("../../public/MP3/ce8e6287c767e45.mp3");

topScore = loadTopScore();

Array.from(bubbles).forEach(bubble => bubble.addEventListener("click", handleClickonBallons));

//-------- Start the game--------------------
const startGame =() => {
    bgMusic.play();
    points = 0;
    updateScoreBoard(points.toString());
    startButton.style.display = "none";
    gameStarted = true;   
    mainGameHandler();
}
startButton.addEventListener("click", startGame);

updateScoreBoard(points.toString());
//---------------------------------

const generateRandomNumber = (from: number, to: number) => {
  return Math.floor((to - from + 1) * Math.random()) + from;
};

const showRandomBalloon = (arrBallons: any ) => {  
  const balloonNumber = arrBallons[generateRandomNumber(0, arrBallons.length - 1)];
  return balloonNumber;
}

function loadTopScore() {
  if (!localStorage) return 0;
  const score = localStorage.getItem("topScore");
  return score ? score : 0;
}

const saveTopScore = (score: string) => {
  if (!localStorage) return;
  localStorage.setItem("topScore", score);
}

const raiseUpBalloon = (bubbleContainer: HTMLDivElement) => {
  bubbleContainer.classList.remove("boom");  
  bubbleContainer.classList.add("up"); 
}

const hideBalloon = (bubbleContainer: HTMLDivElement) => {
  bubbleContainer.classList.remove("up");
}

function updateScoreBoard(points: string) {
  scoreBoard.textContent = "Points: " + points;
  bestScore.dataset.points = topScore;
}

function handleClickonBallons(e: any) {
  const bubbleContainer = e.target.parentElement;
  bubbleContainer.classList.add("boom");
  bubbleContainer.classList.add("up");
  setTimeout(() => {
      hideBalloon(bubbleContainer);
      ballShot.play();
      ++points;      
      updateScoreBoard(points.toString())
   }, 50);
   //---Reload the ballShot (back to the start)---
   ballShot.load();
}

function nextBallonUp() {
  const bubbleContainer = showRandomBalloon(bubbleContainers);
  raiseUpBalloon(bubbleContainer);
  bubbleContainer.timeout = setTimeout(() => {
    hideBalloon(bubbleContainer);   
  },
    generateRandomNumber(800, 2500)
  );
  ++ totalBallons;
  gameBoard.textContent = "Balloon number: " + totalBallons.toString();
}

function mainGameHandler() {
  setTimeout(() => {           
            if (gameStarted && totalBallons <= 19) {             
              if (totalBallons - points == 3) {
                  alert("You have missed 3 balloons. The game is over.");                 
                  gameOver(false)
                  totalBallons = 0;
                  gameBoard.textContent = "Balloon number: " + totalBallons.toString();
                  //---Reload the ballShot (back to the start)---
                  bgMusic.load();
                  return;
              }            
              nextBallonUp();
              mainGameHandler();
          }
     else {    
      gameOver(true)
      bgMusic.load();
    }
  }, generateRandomNumber(500, 2500)
  );
}

const gameOver = (saveTopScoreYN: boolean) =>{
  startButton.style.display = "initial";
  topScore = Math.max(points, topScore); 
  if (!saveTopScoreYN){
    saveTopScore(topScore);
  }   
  updateScoreBoard(points.toString());
}



