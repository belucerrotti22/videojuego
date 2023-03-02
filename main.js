const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const arribaButton = document.querySelector('#arriba');
const abajoButton = document.querySelector('#abajo');
const derechaButton = document.querySelector('#derecha');
const izquierdaButton = document.querySelector('#izquierda');
const cartelGameOver = document.querySelector('#game-over');

const player = 'PLAYER';
const explotion = 'BOMB_COLLISION';
const door = 'O';
let isGameOver = false;
let elementSize;
let canvaSize;
let actualPosition = [undefined, undefined];
let nivelActual = 1;
let mapaActual = [];

window.addEventListener('load', resize);
window.addEventListener('resize', resize);
arribaButton.addEventListener('click', moveUp);
abajoButton.addEventListener('click', moveDown);
derechaButton.addEventListener('click', moveRight);
izquierdaButton.addEventListener('click', moveLeft);

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
            if (actualPosition[0] == undefined && space == door){
                actualPosition[0] = elementSize * i;
                actualPosition[1] = elementSize * (j + 1);
                game.fillText(emojis[player], actualPosition[0], actualPosition[1]);
            }else {
                game.fillText(emojis[space], elementSize * i, elementSize * (j + 1));
            }   
        }
    }
    
}

function clear(){
    game.fillStyle = "rgb(131, 154, 161)";
    game.fillRect(actualPosition[0] + 6, actualPosition[1] - 43, 50, 51);
}


function isPossible(x, y){
    if(mapaActual[y][x] == 'X'){
        mapaActual[y][x] = explotion;
        llenarMapa();
        game.fillText(emojis[player], actualPosition[0], actualPosition[1]);
        return false;
    }
    return true;
}

function coordenadas(position){
    return [(position[0] / elementSize), (position[1] / elementSize) - 1];
}

function gameOver(){
    isGameOver = true;
    setTimeout(() => {
        cartelGameOver.classList.toggle('inactive');
    }, 300);
}

function moveUp(){
    if (!isGameOver){
        clear();
        let actualCoordenadas = coordenadas(actualPosition);
        console.log(actualCoordenadas);
        if (isPossible(actualCoordenadas[0], actualCoordenadas[1] - 1)){
            actualPosition[1] = elementSize * (actualCoordenadas[1]);
            startGame();
            game.fillText(emojis[player], actualPosition[0], actualPosition[1]);
        }else {
            gameOver();
        }
    }
}

function moveDown(){
    if (!isGameOver){
        clear();
        let actualCoordenadas = coordenadas(actualPosition);
        console.log(actualCoordenadas);
        if (isPossible(actualCoordenadas[0], actualCoordenadas[1] + 1)){
            actualPosition[1] = elementSize * (actualCoordenadas[1] + 2);
            startGame();
            game.fillText(emojis[player], actualPosition[0], actualPosition[1]);
        }else {
            gameOver();
        }
    }
}

function moveRight(){
    if (!isGameOver){
        clear();
        let actualCoordenadas = coordenadas(actualPosition);
        console.log(actualCoordenadas);
        if (isPossible(actualCoordenadas[0] + 1, actualCoordenadas[1])){
            actualPosition[0] = elementSize * (actualCoordenadas[0] + 1);
            startGame();
            game.fillText(emojis[player], actualPosition[0], actualPosition[1]);
        }else {
            gameOver();
        }
    }
}

function moveLeft(){
    if (!isGameOver){
        clear();
        let actualCoordenadas = coordenadas(actualPosition);
        console.log(actualCoordenadas);
        if (isPossible(actualCoordenadas[0] - 1, actualCoordenadas[1])){
            actualPosition[0] = elementSize * (actualCoordenadas[0] - 1);
            startGame();
            game.fillText(emojis[player], actualPosition[0], actualPosition[1]);
        }else {
            gameOver();
        }
    }
}
