/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let goodBlockRatio = 0.25;

class Block {
    constructor() {
        this.width = 32;
        this.height = this.width;
        this.x = Math.random() * canvas.width - this.width;
        this.y = 0 - this.height;  // off screen to start
        this.speed = Math.random() * 10 + 1;
        this.isGoodBlock = Math.random() <= goodBlockRatio;
        this.isOffscreen = false;
        this.isCaught = false;
        this.isScored = false;
    }

    update() {
        this.y += this.speed;
        this.isOffscreen = this.y >= canvas.height;
    }

    render() {
        ctx.save();

        ctx.fillStyle = this.isGoodBlock ? 'green' : 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.restore();

    }
}


// let myBlock = new Block();
// console.log(myBlock);

let blocks = [ new Block() ];


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    blocks.push(new Block());

    blocks.forEach((block) => {
        block.update();
        block.render();
    });

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
