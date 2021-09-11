/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let goodBlockRatio = 0.25;
let blockSpawnRate = 500;
const BLOCK_SIZE = 32;

let player = {
	x: 0,
	y: canvas.height - BLOCK_SIZE * 3,
	width: BLOCK_SIZE * 2,
	height: BLOCK_SIZE / 2,

	isMovingLeft: false,
	isMovingRight: false,
	speed: 10,

	update: function () {
		// move left or move right if moving?
		if (this.isMovingLeft) this.x -= this.speed;
		if (this.isMovingRight) this.x += this.speed;
		// make sure we are not off the canvas
		if (this.x < 0) {
			this.x = 0;
		}
		if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;
	},
	render: function () {
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	},
};

window.addEventListener("keydown", (e) => {
	if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
		player.isMovingLeft = true;
	if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
		player.isMovingRight = true;
});

window.addEventListener("keyup", (e) => {
	if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
		player.isMovingLeft = false;
	if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
		player.isMovingRight = false;
});

class Block {
	constructor() {
		this.width = BLOCK_SIZE;
		this.height = this.width;
		this.x = Math.random() * (canvas.width - this.width);
		this.y = 0 - this.height; // off screen to start
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

		ctx.fillStyle = this.isGoodBlock ? "green" : "red";
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.restore();
	}
}

// let myBlock = new Block();
// console.log(myBlock);

let blocks = [new Block()];
let currentTime = 0;
let timeSinceLastBlock = 0;

function gameLoop(timestamp) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let changeInTime = timestamp - currentTime;
	currentTime = timestamp;

	timeSinceLastBlock += changeInTime;
	if (timeSinceLastBlock >= blockSpawnRate) {
		timeSinceLastBlock = 0;
		blocks.push(new Block());
	}

	blocks.forEach((block) => {
		block.update();
		block.render();
	});

	blocks = blocks.filter((b) => !b.isOffscreen);
	//console.log(blocks);

	player.update();
	player.render();

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
