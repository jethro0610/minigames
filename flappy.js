const FRAMERATE = 60;
const PIPE_GAP = 75;

const pipeSprite = new Image();
pipeSprite.src = "pipe.png";

const player = {
    height: 500 / 2,
    gravity: 0
};
let pipes = [];

function randomRange(min, max) {
    range = max - min
    return (Math.random() * range) + min;
}

function createPipes() {
    const holeHeight = randomRange(100, 400);
    const topPipe = {
        x: 500,
        y: -(500 - holeHeight + PIPE_GAP)
    }
    pipes.push(topPipe);

    const bottomPipe = {
        x: 500,
        y: holeHeight + PIPE_GAP
    };
    pipes.push(bottomPipe);
}

function update() {
    pipes.forEach((pipe) => {
        pipe.x -= 5.0;
    });
    pipes = pipes.filter((pipe) => pipe.x > -50);

    player.gravity += 0.5;
    player.height += player.gravity;
    if (player.height > 500)
        player.height = 500;

    function boxesAreTouching(boxA, boxB) {
    }

    let playerTouchPipe = false;
    pipes.forEach((pipe) => {
        const pipeBox = {
            left: pipe.x,
            right: pipe.x + 50,
            top: pipe.y,
            bottom: pipe.y + 500
        };

        const playerBox = {
            left: player.x,
            right: player.x + 15,
            top: player.y,
            bottom: player.y + 15
        };
    });
}

function draw(ctx) {
    ctx.clearRect(0, 0, 0, 0);

    ctx.fillStyle = "gray"
    ctx.fillRect(0, 0, 500, 500);

    ctx.fillStyle = "white"
    ctx.fillRect(500 / 2, player.height, 25, 25);

    pipes.forEach((pipe) => {
        ctx.fillStyle = "red";
        ctx.drawImage(pipeSprite, pipe.x, pipe.y);
    });
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

document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        player.gravity = -8;
    }
})
