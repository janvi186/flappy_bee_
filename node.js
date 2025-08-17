let board;
let boardwidth=360;
let boardheight=640;
let context;

let birdwidth=54;
let birdheight=54;
let birdx = birdwidth/8;
let birdy = birdheight/2;
let birdimg;

let bird={
    x: birdx,
    y: birdy,
    width: birdwidth,
    height: birdheight
};

//pipes
let pipeArray=[];
let pipeWidth=64;
let pipeHeight=512;
let pipeX=boardwidth;
let pipeY=0;

let toppipeimg;
let bottompipeimg;

//movement
let velocityX=-2;
let velocityY=0;
let gravity=0.4;

let gameOver=false;
let score=0; // ✅ added score

window.onload=function(){
    board=document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context=board.getContext("2d");

    birdimg=new Image();
    birdimg.src="bee.png";
    birdimg.onload=function(){
        context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);
    }

    toppipeimg=new Image();
    toppipeimg.src="top.png";

    bottompipeimg=new Image();
    bottompipeimg.src="bottom.png";

    requestAnimationFrame(update);
    setInterval(placePipes,1500);
    document.addEventListener("keydown",moveBird);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver) return;

    context.clearRect(0,0,board.width,board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y+velocityY,0);
    context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);

    if (bird.y + bird.height >= boardheight) {
    gameOver = true;
}


    //pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe=pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        //scoring
        if(!pipe.passed && pipe.x + pipe.width < bird.x){
            score += 0.5; // half per pipe, so full point per pair
            pipe.passed = true;
        }

        if(detectCollision(bird,pipe)){
            gameOver=true;
        }
    }

    //remove old pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }

    //score
    // Score text - CENTER TOP// Set font to pixel style
// Score text (top center)
context.font = "40px 'Press Start 2P'";
context.fillStyle = "yellow";
context.strokeStyle = "black";
context.lineWidth = 3;
context.textAlign = "center";

context.fillText(Math.floor(score), boardwidth / 2, 50);
context.strokeText(Math.floor(score), boardwidth / 2, 50);

// Game Over text (smaller, center screen)
if (gameOver) {
    context.font = "30px 'Press Start 2P'";  // smaller font for game over
    context.fillText("GAME OVER", boardwidth / 2, 120);
    context.strokeText("GAME OVER", boardwidth / 2, 120);
}


}

function placePipes(){
    if(gameOver) return;

    let randompipeY=pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);

    let topPipe={
        img: toppipeimg,
        x: pipeX,
        y: randompipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let openingSpace=200;
    let bottomPipe={
        img: bottompipeimg,
        x: pipeX,
        y: randompipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(e.code=="Space"||e.code=="ArrowUp"||e.code=="KeyX"){
        velocityY=-6;

        //reset game
        if(gameOver){
            bird.y=birdy; // ✅ fixed: was birdY
            pipeArray=[];
            score=0;
            velocityY=0;
            gameOver=false;
        }
    }
}

function detectCollision(a,b){
    let padding=20;
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
