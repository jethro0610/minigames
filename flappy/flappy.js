const FRAMERATE = 60;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;

const PLAYER_SIZE = 16;

const PIPE_GAP = 75;
const PIPE_WIDTH = 50;

const pipeSprite = new Image();
pipeSprite.src = "pipe.png";
const subSprite = new Image();
subSprite.src = "sub.png";

let player = {
    x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
    y: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
    gravity: 0
};
let pipes = [];
let fail = false;
let score = 0;

function reset() {
    player = {
        x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
        y: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
        gravity: 0
    };
    pipes = [];
    fail = false;
    score = 0;
    updateScore();
}

function randomRange(min, max) {
    range = max - min
    return (Math.random() * range) + min;
}

function updateScore() {
    document.getElementById("score").innerHTML = "Score: " + score.toString();
}

function createPipes() {
    const holeHeight = randomRange(100, 400);
    const topPipe = {
        x: GAME_WIDTH,
        y: -(GAME_HEIGHT - holeHeight + PIPE_GAP),
        passed: false,
        top: true
    }
    pipes.push(topPipe);

    const bottomPipe = {
        x: GAME_WIDTH,
        y: holeHeight + PIPE_GAP,
        passed: false,
        top: false
    };
    pipes.push(bottomPipe);
}

function update() {
    player.gravity += 0.5;
    player.y += player.gravity;
    if (player.y + PLAYER_SIZE > GAME_HEIGHT) {
        player.gravity = 0.0;
        player.y = GAME_HEIGHT - PLAYER_SIZE;
        fail = true;
    }

    if (fail)
        return;

    pipes.forEach((pipe) => {
        pipe.x -= 5.0;
        if (pipe.top && pipe.x < GAME_WIDTH / 2 && !pipe.passed) {
            pipe.passed = true;
            score++;
            updateScore();
        }
    });
    pipes = pipes.filter((pipe) => pipe.x > -50);

    function boxesAreTouching(boxA, boxB) {
        if (
            boxA.left > boxB.right ||
            boxA.right < boxB.left ||
            boxA.top > boxB.bottom ||
            boxA.bottom < boxB.top
        ) {
            return false;
        }
        else {
            return true;
        }
    }

    let playerTouchPipe = false;
    pipes.forEach((pipe) => {
        const pipeBox = {
            left: pipe.x,
            right: pipe.x + PIPE_WIDTH,
            top: pipe.y,
            bottom: pipe.y + GAME_HEIGHT
        };

        const playerBox = {
            left: player.x,
            right: player.x + PLAYER_SIZE,
            top: player.y,
            bottom: player.y + PLAYER_SIZE
        };
        if (boxesAreTouching(playerBox, pipeBox))
            playerTouchPipe = true
    });

    if (playerTouchPipe) {
        fail = true;
    }
}

function draw(ctx) {
    ctx.clearRect(0, 0, 0, 0);

    ctx.fillStyle = "#514680"
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    pipes.forEach((pipe) => {
        ctx.drawImage(pipeSprite, pipe.x, pipe.y);
    });

    ctx.drawImage(subSprite, player.x - 32, player.y - 32, 64, 64);
}

window.addEventListener('load', function() {
    createPipes();
    const canvas = document.getElementById("game-window");
    const ctx = canvas.getContext("2d");

    setInterval(() => {
        createPipes();
    }, 1000);

    setInterval(() => {
        update(ctx);
        draw(ctx);
    }, 1000 / FRAMERATE);
})

document.addEventListener("keydown", event => {
    if (event.code == "Space" && !fail) {
        player.gravity = -8;
    }

    if (event.code == "Enter") {
        console.log("ent");
        reset();
    }
})
