// FALTA VERIFICAR QUE EL JUGADOR NO SE SALGA DEL MAPA, AGREGAR LO DE LAS VIDAS Y EL TIEMPO, 
// HACER QUE EL USUARIO SE PUEDA MOVER SIN TOCAR LOS BOTONES, SOLO EL TECLADO Y LO DEL TIEMPO RÉCORD

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
let nivelActual = firstLevel;
let mapaActual = [];

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



function moveByKeys(event){
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowDown') moveDown();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowLeft') moveLeft();
}

function restartGame(){
    if (isGameOver){
        isGameOver = false;
        cartelGameOver.classList.toggle('inactive');
    }else {
        cartelGameWon.classList.toggle('inactive');
    }
    nivelActual = firstLevel;
    playerPos.x = undefined;
    playerPos.y = undefined;
    clearAll();
    startGame();
}

function resize(){

    if (window.innerHeight > window.innerWidth){
        canvaSize = window.innerWidth * 0.75;
    }else {
        canvaSize = window.innerHeight * 0.75;
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
}

function llenarMapa(){
    for (let i = 0; i < 10; i++){
        for (let j = 0; j < 10; j++){
            let space = mapaActual[j][i];
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

function clear(){
    game.fillStyle = "rgb(131, 154, 161)";
    game.fillRect(playerPos.x + 6, playerPos.y - 41, 45, 50);
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
    return {x: (position.x / elementSize), y:(position.y / elementSize) - 1};
}

function gameOver(x, y){
    isGameOver = true;
    mapaActual[y][x] = explotion;
    llenarMapa();
    game.fillText(emojis[player], playerPos.x, playerPos.y);
    setTimeout(() => {
        cartelGameOver.classList.toggle('inactive');
    }, 300);
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
        makeMove(actualCoords, move);
        startGame();
        game.fillText(emojis[player], playerPos.x, playerPos.y);
    }
}

function moveUp(){
    if (!isGameOver){
        let actualCoords = coordenadas(playerPos);
        let newX = Math.round(actualCoords.x);
        let newY = Math.round(actualCoords.y - 1);
        verifyMove(actualCoords, newX, newY, 'Up');
    }
}

function moveDown(){
    if (!isGameOver){
        let actualCoords = coordenadas(playerPos);
        let newX = Math.round(actualCoords.x);
        let newY = Math.round(actualCoords.y + 1);
        verifyMove(actualCoords, newX, newY, 'Down');
    }
}

function moveRight(){
    if (!isGameOver){
        let actualCoords = coordenadas(playerPos);
        let newX = Math.round(actualCoords.x + 1);
        let newY = Math.round(actualCoords.y);
        verifyMove(actualCoords, newX, newY, 'Right');
    }
}

function moveLeft(){
    if (!isGameOver){
        let actualCoords = coordenadas(playerPos);
        let newX = Math.round(actualCoords.x - 1);
        let newY = Math.round(actualCoords.y);
        verifyMove(actualCoords, newX, newY, 'Left');
    }
}
