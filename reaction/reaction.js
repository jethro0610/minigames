const MIN_FIRE_TIME = 250;
const MAX_FIRE_TIME = 2000;
const INITIAL_CPU_REACTION_TIME = 600; 

let started = false;
let canFire = false;
let over = false;
let cpuLevel = 0;
let winStreak = 0;
let playerScore = 0;
let cpuScore = 0.0;

function reset(resetScore) {
    started = false;
    canFire = false;
    over = false;
    setSprite("player", "idle.png");
    setSprite("cpu", "idle.png");
    setTitle("Press spacebar when ready");

    if (resetScore) {
        cpuLevel = 0;
        winStreak = 0;
        playerScore = 0;
        cpuScore = 0.0;
    }
}

function setSprite(id, sprite) {
    document.getElementById(id).src = sprite;
}

function randomRange(min, max) {
    range = max - min
    return (Math.random() * range) + min;
}

function setTitle(text) {
    const title = document.getElementById("title");
    title.innerHTML = text;
}

function updateScore() {
    const score = document.getElementById("score");
    score.innerHTML = playerScore.toString() + " - " + cpuScore.toString();
}

function queueReset() {
    setTimeout(() => {
        reset();
    }, 1500)
}

function startFire() {
    setTitle("Ready...");
    started = true;
    canFire = false;

    const fireTime = randomRange(MIN_FIRE_TIME, MAX_FIRE_TIME);
    setTimeout(() => {
        if (started && !over) {
            setTitle("Fire!");
            canFire = true;
        }
    }, fireTime);

    const reactionTime = INITIAL_CPU_REACTION_TIME - cpuLevel * 125;
    console.log(reactionTime);
    setTimeout(() => {
        if (started && !over) {
            over = true;
            canFire = false;
            cpuScore++;
            winStreak = 0;
            cpuLevel -= 0.5;
            setTitle("CPU wins!");
            setSprite("cpu", "win.png");
            setSprite("player", "lose.png");
            updateScore();
            queueReset();
        }
    }, fireTime + reactionTime);
}

function onSpacePressed() {
    if (over)
        return;

    if (!started) {
        startFire();
    }
    else if (canFire) {
        over = true;
        canFire = false;                
        playerScore++;
        winStreak++;
        cpuLevel += winStreak;
        setTitle("Player wins!");
        setSprite("cpu", "lose.png");
        setSprite("player", "win.png");
        updateScore();
        queueReset();
    }
    else {
        over = true;
        canFire = false;
        cpuScore++;
        winStreak = 0;
        setTitle("Misfire...");
        setSprite("cpu", "win.png");
        setSprite("player", "misfire.png");
        updateScore();
        queueReset();
    }
}

document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        onSpacePressed();
    }
})
