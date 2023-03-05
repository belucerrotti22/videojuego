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

const player = 'PLAYER';
const explotion = 'BOMB_COLLISION';
const bomb = 'X';
const win = 'WIN';
const gift = 'I';
const door = 'O';
const firstLevel = 0;
const secondLevel = 1;
const finalLevel = 2;
let isGameOver = false;
let elementSize;
let canvaSize;
let actualPos = [undefined, undefined];
let nivelActual = firstLevel;
let mapaActual = [];

window.addEventListener('load', resize);
window.addEventListener('resize', resize);
arribaButton.addEventListener('click', moveUp);
abajoButton.addEventListener('click', moveDown);
derechaButton.addEventListener('click', moveRight);
izquierdaButton.addEventListener('click', moveLeft);
buttonTryAgain.addEventListener('click', restartGame);
buttonPlayAgain.addEventListener('click', restartGame);

function restartGame(){
    if (isGameOver){
        isGameOver = false;
        cartelGameOver.classList.toggle('inactive');
    }else {
        cartelGameWon.classList.toggle('inactive');
    }
    nivelActual = firstLevel;
    actualPos = [undefined, undefined];
    clearAll();
    startGame();
}

function resize(){

    if (window.innerHeight > window.innerWidth){
        canvaSize = window.innerWidth * 0.8;
    }else {
        canvaSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('height', canvaSize);
    canvas.setAttribute('width', canvaSize);

    elementSize = (canvaSize - 12) / 10;

    startGame();
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
    console.log(mapaActual);
}

function llenarMapa(){
    for (let i = 0; i < 10; i++){
        for (let j = 0; j < 10; j++){
            let space = mapaActual[j][i];
            if (actualPos[0] == undefined && space == door){
                actualPos[0] = elementSize * i;
                actualPos[1] = elementSize * (j + 1);
                game.fillText(emojis[player], actualPos[0], actualPos[1]);
            }else if (space == gift && nivelActual == finalLevel) {
                mapaActual[j][i] = win;
                game.fillText(emojis[win], elementSize * i, elementSize * (j + 1));
            }else {
                game.fillText(emojis[space], elementSize * i, elementSize * (j + 1));
            }   
        }
    }
    
}

function clear(){
    game.fillStyle = "rgb(131, 154, 161)";
    game.fillRect(actualPos[0] + 6, actualPos[1] - 41, 45, 50);
}

function clearAll(){
    game.fillStyle = "rgb(131, 154, 161)";
    game.fillRect(0, 0, canvas.width, canvas.height);
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
    return [(position[0] / elementSize), (position[1] / elementSize) - 1];
}

function gameOver(x, y){
    isGameOver = true;
    mapaActual[y][x] = explotion;
    llenarMapa();
    game.fillText(emojis[player], actualPos[0], actualPos[1]);
    setTimeout(() => {
        cartelGameOver.classList.toggle('inactive');
    }, 300);
}

function moveUp(){
    if (!isGameOver){
        let actualCoords = coordenadas(actualPos);
        let newX = actualCoords[0];
        let newY = actualCoords[1] - 1;
        if (isThereABomb(newX, newY)){
            gameOver(newX, newY);
        }else if (isGameWon(newX, newY)) {
            cartelGameWon.classList.toggle('inactive');
        }else {
            if (isLevelWon(newX, newY)){
                nivelActual++;
                clearAll();
            }
            clear();
            actualPos[1] = elementSize * (actualCoords[1]);
            startGame();
            game.fillText(emojis[player], actualPos[0], actualPos[1]);
        }
    }
}

function moveDown(){
    if (!isGameOver){
        let actualCoords = coordenadas(actualPos);
        let newX = actualCoords[0];
        let newY = actualCoords[1] + 1;
        if (isThereABomb(newX, newY)){
            gameOver(newX, newY);
        }else if (isGameWon(newX, newY)) {
            cartelGameWon.classList.toggle('inactive');
        }else {
            if (isLevelWon(newX, newY)){
                nivelActual++;
                clearAll();
            }
            clear();
            actualPos[1] = elementSize * (actualCoords[1] + 2);
            startGame();
            game.fillText(emojis[player], actualPos[0], actualPos[1]);
        }
    }
}

function moveRight(){
    if (!isGameOver){
        let actualCoords = coordenadas(actualPos);
        let newX = actualCoords[0] + 1;
        let newY = actualCoords[1];
        if (isThereABomb(newX, newY)){
            gameOver(newX, newY);
        }else if (isGameWon(newX, newY)) {
            cartelGameWon.classList.toggle('inactive');
        }else {
            if (isLevelWon(newX, newY)){
                nivelActual++;
                clearAll();
            }
            clear();
            actualPos[0] = elementSize * (actualCoords[0] + 1);
            startGame();
            game.fillText(emojis[player], actualPos[0], actualPos[1]);
        }
    }
}

function moveLeft(){
    if (!isGameOver){
        let actualCoords = coordenadas(actualPos);
        let newX = actualCoords[0] - 1;
        let newY = actualCoords[1];
        if (isThereABomb(newX, newY)){
            gameOver(newX, newY);
        }else if (isGameWon(newX, newY)) {
            cartelGameWon.classList.toggle('inactive');
        }else {
            if (isLevelWon(newX, newY)){
                nivelActual++;
                clearAll();
            }
            clear();
            actualPos[0] = elementSize * (actualCoords[0] - 1);
            startGame();
            game.fillText(emojis[player], actualPos[0], actualPos[1]);
        }
    }
}
