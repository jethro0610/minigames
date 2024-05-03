// Canvas and rendering constants
const FRAMERATE = 60;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;

// Dimension constants
const PLAYER_SIZE = 32;
const PIPE_GAP = 60;
const PIPE_WIDTH = 50;

// Sprites
// Image source: self-made
// [https://opensource.org/license/mit]
const pipeSprite = new Image();
pipeSprite.src = "pipe.png";

// Image source: self-made
// [https://opensource.org/license/mit]
const subSprite = new Image();
subSprite.src = "sub.png";

// Game state
let player = {
    x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
    y: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
    gravity: 0
};
let pipes = [];
let fail = false;
let failTimer = 0;
let pause = true;
let score = 0;

function reset() {
    player = {
        x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
        y: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
        gravity: 0
    };
    pipes = [];
    fail = false;
    failTimer = 0
    pause = true;
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
    // Randomly generate where the hole is...
    const holeHeight = randomRange(100, 400);

    // ...and place the top pipe so its bottom
    // is at the hole's height is. Since canvas
    // objects start from the top-left corner,
    // the object must be offset by negative
    // GAME_HEIGHT...
    const topPipe = {
        x: GAME_WIDTH,
        y: -(GAME_HEIGHT - holeHeight + PIPE_GAP),
        passed: false,
        top: true
    }
    pipes.push(topPipe);

    // ..and the bottom pipe can just be
    // positioned at the hole height since it 
    // starts from the top
    const bottomPipe = {
        x: GAME_WIDTH,
        y: holeHeight + PIPE_GAP,
        passed: false,
        top: false
    };
    pipes.push(bottomPipe);
}

function update() {
    // Paused game should not update at all
    if (pause)
        return;

    // Compute the player's gravity
    player.gravity += 0.5;
    player.y += player.gravity;

    // When the player hits the floor, they should
    // stay there and the game should be failed
    if (player.y + PLAYER_SIZE > GAME_HEIGHT) {
        player.gravity = 0.0;
        player.y = GAME_HEIGHT - PLAYER_SIZE;
        fail = true;
    }

    // Failed games should not move the pipes
    if (fail) {
        // The fail timer ticks up, which is
        // used to draw the white flash when
        // hitting a pipe or the floor
        failTimer++;

        return;
    }

    pipes.forEach((pipe) => {
        // Move every pipe towards the left...
        pipe.x -= 5.0;

        // ...and when a top pipe passes the center of 
        // the screen increase the score. Note only the
        // top pipe is used to avoid 2-points being added
        if (pipe.top && pipe.x < GAME_WIDTH / 2 && !pipe.passed) {
            pipe.passed = true;
            score++;
            updateScore();
        }
    });

    // Any pipes that leave the screen are removed
    // from the pipes list
    pipes = pipes.filter((pipe) => pipe.x > -50);

    // This function test two bounding boxes for
    // collision
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

    // Any time the player touches the pipe, we
    // need to fail the game
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
    if (playerTouchPipe)
        fail = true;
}

function draw(ctx) {
    ctx.clearRect(0, 0, 0, 0);

    // Draw the background
    ctx.fillStyle = "#514680"
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw the pipes
    pipes.forEach((pipe) => {
        ctx.drawImage(pipeSprite, pipe.x, pipe.y);
    });

    // Draw the player
    ctx.drawImage(subSprite, player.x, player.y);

    // Fail percent uses the fail timer to determine
    // the opacity of the white flash. This set of
    // operations makes the percent 1.0 when the 
    // time is at 4 and 0.0 at 0.0 and 8.0.
    let failPercent = Math.min(failTimer, 8.0);
    failPercent -= 4.0;
    failPercent = Math.abs(failPercent);
    failPercent /= 4.0;
    failPercent = 1.0 - failPercent;

    // Draw the white flash
    ctx.fillStyle = "rgba(255, 255, 255," + failPercent.toString() + ")";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

window.addEventListener('load', function() {
    const canvas = document.getElementById("game-window");
    const ctx = canvas.getContext("2d");

    // Create pipes every second when
    // valid
    setInterval(() => {
        if (!pause || fail)
            createPipes();
    }, 1000);

    // Update the game and draw based
    // on the framerate
    setInterval(() => {
        update(ctx);
        draw(ctx);
    }, 1000 / FRAMERATE);
})

document.addEventListener("keydown", event => {
    if (event.code == "Space" && !fail) {
        if (pause) {
            // Unpause the game
            pause = false;
        }
        else {
            // Make the player jump
            player.gravity = -8;
        }
    }

    if (event.code == "Enter") {
        reset();
    }
})
