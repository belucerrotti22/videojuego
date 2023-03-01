const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const arribaButton = document.querySelector('#arriba');
const abajoButton = document.querySelector('#abajo');
const derechaButton = document.querySelector('#derecha');
const izquierdaButton = document.querySelector('#izquierda');

const player = 'PLAYER';
const door = 'O';
let elementSize;
let canvaSize;
let actualPosition = [undefined, undefined];
let nivelActual = 0;

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

/*function mapaActual(){
    let mapa = [];
    let elements = iterator(maps);
    for (let i = 0; i < 10; i++){
        for (let j = 0; j < 10; j++){
            mapa[i][j] = elements.next().value;
        }
    }
    return mapa;
}*/

function startGame(){

    game.font = elementSize + 'px Verdana';
    game.textAlign = '';

    let mapStructure = iterator(maps);
    
    for (let i = 0; i < 10; i++){
        for (let j = 1; j < 11; j++){
            let space = mapStructure.next().value
            if (actualPosition[0] == undefined && space == door){
                actualPosition[0] = elementSize * i;
                actualPosition[1] = elementSize * j;
                game.fillText(emojis[player], actualPosition[0], actualPosition[1]);
            }else {
                game.fillText(emojis[space], elementSize * i, elementSize * j);
            }            
        }
    }
}

function clear(){
    game.fillStyle = "rgb(131, 154, 161)";
    game.fillRect(actualPosition[0], actualPosition[1] - 43, 52, 58);
}

/*
function isPossible(x, y){
    let mapa = mapaActual();
    if(mapa[x][y] == 'X'){
        return false;
    }
}*/

function moveUp(){
    clear();
    let j = actualPosition[1] / elementSize;
    let newPosition = elementSize * (j - 1);
    actualPosition[1] = newPosition;
    startGame();
    game.fillText(emojis[player], actualPosition[0], actualPosition[1]);
}

function moveDown(){
    clear();
    game.fillRect(actualPosition[0], actualPosition[1] - 43, 52, 58);
    let j = actualPosition[1] / elementSize;
    let newPosition = elementSize * (j + 1);
    actualPosition[1] = newPosition;
    startGame();
    game.fillText(emojis[player], actualPosition[0], actualPosition[1]);
}

function moveRight(){
    clear();
    game.fillRect(actualPosition[0], actualPosition[1] - 43, 52, 58);
    let i = actualPosition[0] / elementSize;
    let newPosition = elementSize * (i + 1);
    actualPosition[0] = newPosition;
    startGame();
    game.fillText(emojis[player], actualPosition[0], actualPosition[1]);
}

function moveLeft(){
    clear();
    game.fillRect(actualPosition[0], actualPosition[1] - 43, 52, 58);
    let i = actualPosition[0] / elementSize;
    let newPosition = elementSize * (i - 1);
    actualPosition[0] = newPosition;
    startGame();
    game.fillText(emojis[player], actualPosition[0], actualPosition[1]);
}
