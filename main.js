// AGREGAR LO DEL TIEMPO Y LO DEL TIEMPO RÉCORD

const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const arribaButton = document.querySelector('#arriba');
const abajoButton = document.querySelector('#abajo');
const derechaButton = document.querySelector('#derecha');
const izquierdaButton = document.querySelector('#izquierda');
const cartelGameOver = document.querySelector('#game-over');
const cartelGameWon = document.querySelector('#game-won');
const buttonTryAgain = document.querySelector('#try-again');
const buttonPlayAgain = document.querySelector('#play-again');
const livesCounterText = document.querySelector('#lives');
const gameClock = document.querySelector('#time');
const recordTime = document.querySelector('#record');

const player = 'PLAYER';
const explotion = 'BOMB_COLLISION';
const bomb = 'X';
const win = 'WIN';
const gift = 'I';
const door = 'O';
const firstLevel = 0;
const secondLevel = 1;
const finalLevel = 2;
const full = 3;
const empty = 0;
let clockNumber = 0;
let lives = full;
let isGameOver = false;
let isGameFinished = false;
let elementSize;
let canvaSize;
let nivelActual = firstLevel;
let mapaActual = [];
let timer;
let record = 0;

const inicialPos = {
    x: undefined,
    y: undefined
}

const playerPos = {
    x: undefined,
    y: undefined
}

window.addEventListener('keydown', moveByKeys);
window.addEventListener('load', resize);
window.addEventListener('resize', resize);
arribaButton.addEventListener('click', moveUp);
abajoButton.addEventListener('click', moveDown);
derechaButton.addEventListener('click', moveRight);
izquierdaButton.addEventListener('click', moveLeft);
buttonTryAgain.addEventListener('click', restartGame);
buttonPlayAgain.addEventListener('click', restartGame);

livesCounter();
startClock();
showRecord();

function showRecord(){
    recordTime.innerHTML = 'Recórd: ' + record;
}

function startClock(){
    timer = setInterval(() => clockwork(), 10);
}

function livesCounter(){
    let text = 'Lives left: ';
    let i = lives;
    while (i > empty){
        text += emojis['HEART'];
        i--;
    }
    livesCounterText.innerHTML = text;
}

function clockwork(){
    clockNumber += 0.01;
    gameClock.innerHTML = 'Time: ' + clockNumber.toFixed(2);
}


function moveByKeys(event){
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowDown') moveDown();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowLeft') moveLeft();
}

function restartGame(){
    clockNumber = 0;
    if (isGameOver){
        isGameOver = false;
        cartelGameOver.classList.toggle('inactive');
    }else {
        cartelGameWon.classList.toggle('inactive');
        isGameFinished = false;
    }
    nivelActual = firstLevel;
    playerPos.x = undefined;
    playerPos.y = undefined;
    lives = full;
    clearAll();
    startGame();
    livesCounter();
    startClock();
    showRecord();
}

function resize(){

    if (window.innerHeight > window.innerWidth){
        canvaSize = window.innerWidth * 0.75;
    }else {
        canvaSize = window.innerHeight * 0.75;
    }

    canvas.setAttribute('height', canvaSize);
    canvas.setAttribute('width', canvaSize);

    elementSize = (canvaSize - 9) / 10;

    startGame();
    game.fillText(emojis[player], playerPos.x, playerPos.y);
}

function * iterator(maps){
    let elementsMap = maps[nivelActual].split('');
    for (let element of  elementsMap){
        yield element;
    }
}

function startGame(){

    game.font = elementSize + 'px Verdana';
    game.textAlign = '';

    let mapStructure = iterator(maps);
    
    for (let i = 0; i < 10; i++){
        mapaActual[i] = [];
        for (let j = 0; j < 10; j++){
            let space = mapStructure.next().value
            mapaActual[i][j] = space;
        }
    }

    llenarMapa();
}

function llenarMapa(){
    clearAll();
    for (let i = 0; i < 10; i++){
        for (let j = 0; j < 10; j++){
            let space = mapaActual[j][i];
            if (space == door){
                inicialPos.x = elementSize * i;
                inicialPos.y = elementSize * (j + 1);
            }

            if (playerPos.x == undefined && space == door){
                playerPos.x = elementSize * i;
                playerPos.y = elementSize * (j + 1);
                game.fillText(emojis[player], playerPos.x, playerPos.y);
            }else if (space == gift && nivelActual == finalLevel) {
                mapaActual[j][i] = win;
                game.fillText(emojis[win], elementSize * i, elementSize * (j + 1));
            }else {
                game.fillText(emojis[space], elementSize * i, elementSize * (j + 1));
            }   
        }
    }
}

function clearAll(){
    game.clearRect(0, 0, canvaSize, canvaSize);
}

function isThereABomb(x, y){
    return mapaActual[y][x] == bomb;
}

function isGameWon(x, y){
    return mapaActual[y][x] == win;
}

function isLevelWon(x, y){
    return mapaActual[y][x] == gift;
}

function coordenadas(position){
    return {x: (position.x / elementSize), y:(position.y / elementSize) - 1};
}

function checkRecord(){
    if (clockNumber < record || record == 0) record = clockNumber.toFixed(2);
}

function gameOver(){
    llenarMapa();
    clearInterval(timer);
    game.fillText(emojis[player], playerPos.x, playerPos.y);
    setTimeout(() => {
        cartelGameOver.classList.toggle('inactive');
    }, 360);
}

function makeMove(actualCoords, move){
    switch (move) {
        case 'Up':
            playerPos.y = elementSize * (actualCoords.y);  
            break;

        case 'Down':
            playerPos.y = elementSize * (actualCoords.y + 2);
            break;

        case 'Right':
            playerPos.x = elementSize * (actualCoords.x + 1);
            break;

        case 'Left':
            playerPos.x = elementSize * (actualCoords.x - 1);
            break;
    }
}

function verifyMove(actualCoords, newX, newY, move){
    if (mapaActual[newY][newX]){
        if (isThereABomb(newX, newY)){
            lives--;
            livesCounter();
            playerPos.x = inicialPos.x;
            playerPos.y = inicialPos.y;
            mapaActual[newY][newX] = explotion;
            llenarMapa();
            game.fillText(emojis[player], playerPos.x, playerPos.y);
        }else if (isGameWon(newX, newY)) {
            cartelGameWon.classList.toggle('inactive');
            clearInterval(timer);
            checkRecord();
            isGameFinished = true;
        }else {
            if (isLevelWon(newX, newY)){
                nivelActual++;
                clearAll();
                makeMove(actualCoords, move);
                startGame();
            }else {
                makeMove(actualCoords, move);
                llenarMapa();
            }
            game.fillText(emojis[player], playerPos.x, playerPos.y);
        }
    }
}

function verifyLives(){
    if (lives == empty){
        isGameOver = true;
        gameOver();
    }
}

function moveUp(){
    if (!isGameOver && !isGameFinished){
        let actualCoords = coordenadas(playerPos);
        let newX = Math.round(actualCoords.x);
        let newY = Math.round(actualCoords.y - 1);
        verifyMove(actualCoords, newX, newY, 'Up');
        verifyLives();
    }
}

function moveDown(){
    if (!isGameOver && !isGameFinished){
        let actualCoords = coordenadas(playerPos);
        let newX = Math.round(actualCoords.x);
        let newY = Math.round(actualCoords.y + 1);
        verifyMove(actualCoords, newX, newY, 'Down');
        verifyLives();
    }
}

function moveRight(){
    if (!isGameOver && !isGameFinished){
        let actualCoords = coordenadas(playerPos);
        let newX = Math.round(actualCoords.x + 1);
        let newY = Math.round(actualCoords.y);
        verifyMove(actualCoords, newX, newY, 'Right');
        verifyLives();
    }
}

function moveLeft(){
    if (!isGameOver && !isGameFinished){
        let actualCoords = coordenadas(playerPos);
        let newX = Math.round(actualCoords.x - 1);
        let newY = Math.round(actualCoords.y);
        verifyMove(actualCoords, newX, newY, 'Left');
        verifyLives();
    }
}