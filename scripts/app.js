/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const audioBadCatch = document.getElementById("audioBadCatch");
const audioGoodCatch = document.getElementById("audioGoodCatch");
const audioReduceScore = document.getElementById("audioReduceScore");
const audioWin = document.getElementById("audioWin");
const audioLose = document.getElementById("audioLose");

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

	color: 0,

	update: function () {
		// move left or move right if moving?
		if (this.isMovingLeft) this.x -= this.speed;
		if (this.isMovingRight) this.x += this.speed;
		// make sure we are not off the canvas
		if (this.x < 0) {
			this.x = 0;
		}
		if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;
		this.color += 10;
		if (this.color >= 350) this.color = 0;
	},
	render: function () {
		ctx.save();
		ctx.fillStyle = `hsl(${this.color}, 100%, 50%)`;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.stroke();
		ctx.restore();
	},
};

let sbImage = new Image();
sbImage.src = "../images/scoreboard.png";

let scoreBoard = {
	goodTally: 0,
	badTally: 0,
	goodBlocks: [],
	badBlocks: [],
	x: 8,
	y: 544,
	scoredBlockY: 552,
	victoryBlockX: 384,
	isGameOver: false,
	didPlayerWin: false,

	scoreBlock: function (block) {
		let goodStartingX = 16;
		let badStartingX = 752;
		let scoreBlockSpacing = 40;
		let spacingMultiplier = 0;

		if (block.isGoodBlock) {
			this.goodTally++;
			this.goodBlocks.push(block);
			spacingMultiplier = this.goodBlocks.length - 1;
			if (spacingMultiplier < 8) {
				block.x = goodStartingX + spacingMultiplier * scoreBlockSpacing;
				audioGoodCatch.play();
			} else {
				audioWin.play();
				block.x = this.victoryBlockX;
				this.isGameOver = true;
				didPlayerWin = true;
			}
		} else {
			this.badTally++;
			this.badBlocks.push(block);
			block.x = badStartingX;
			spacingMultiplier = this.badBlocks.length - 1;
			if (spacingMultiplier < 8) {
				block.x = badStartingX - spacingMultiplier * scoreBlockSpacing;
				audioBadCatch.play();
			} else {
				audioLose.play();
				block.x = this.victoryBlockX;
				this.isGameOver = true;
				didPlayerWin = false;
			}
		}
		block.isScored = true;
		block.y = this.scoredBlockY;
	},
	reduceScore: function () {
		if (this.goodBlocks.length) {
			this.goodBlocks.pop();
			this.goodTally--;
			audioReduceScore.play();
		}
	},
	update: function () {},
	render: function () {
		ctx.save();
		ctx.drawImage(sbImage, this.x, this.y);
		this.goodBlocks.forEach((block) => block.render());
		this.badBlocks.forEach((block) => block.render());
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

		this.isFading = false;
		this.opacity = 1;
		this.color = this.isGoodBlock ? 120 : 0;
	}

	update() {
		this.y += this.speed;
		this.isOffscreen = this.y >= canvas.height;
		this.checkForCatch();
		if (this.isFading) this.opacity -= 0.1;
	}

	render() {
		ctx.save();
		ctx.fillStyle = `hsla(${this.color}, 100%, 50%, ${this.opacity})`;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}

	checkForCatch() {
		if (this.isOffscreen && !this.isScored && this.isGoodBlock) {
			scoreBoard.reduceScore();
			this.isScored = true;
			return;
		}

		if (this.isFading || this.isOffscreen || this.isCaught || this.isScored)
			return;

		// if I am above the catch block, return
		let bottom = this.y + this.height;
		if (bottom < player.y) return;

		let rhs = this.x + this.width;
		if (rhs < player.x || this.x > player.x + player.width) {
			this.isFading = true;
			return;
		}

		scoreBoard.scoreBlock(this);
		this.isCaught = true;
	}
}

class StaticBackgroundLayer {
	constructor(image) {
		this.x = 0;
		this.y = 0;
		this.height = canvas.height;
		this.width = canvas.width;
		this.image = image;
	}
	update() {}
	render() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

class HorizontalScrollingBackgroundLayer extends StaticBackgroundLayer {
	constructor(image, scrollSpeed) {
		super(image);
		this.width = canvas.width * 2;
		this.scrollSpeed = scrollSpeed;
	}
	update() {
		this.x -= this.scrollSpeed;
		if (this.x <= this.width * -1) this.x = 0;
	}
	render() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		ctx.drawImage(
			this.image,
			this.x + this.width,
			this.y,
			this.width,
			this.height
		);
	}
}

let cloudsFar = new Image();
cloudsFar.src = "../images/clouds-far.png";
let cloudsMedium = new Image();
cloudsMedium.src = "../images/clouds-medium.png";
let cloudsNear = new Image();
cloudsNear.src = "../images/clouds-near.png";
let cloudsClose = new Image();
cloudsClose.src = "../images/clouds-close.png";

let mountainsFar = new Image();
mountainsFar.src = "../images/mountains-far.png";
let mountainsMedium = new Image();
mountainsMedium.src = "../images/mountains-medium.png";
let mountainsNear = new Image();
mountainsNear.src = "../images/mountains-near.png";

let layer0 = new HorizontalScrollingBackgroundLayer(cloudsFar, 0.05);
let layer1 = new HorizontalScrollingBackgroundLayer(cloudsMedium, 0.1);
let layer2 = new HorizontalScrollingBackgroundLayer(cloudsNear, 0.15);
let layer3 = new HorizontalScrollingBackgroundLayer(cloudsClose, 0.3);

let staticLayer0 = new StaticBackgroundLayer(mountainsFar);
let staticLayer1 = new StaticBackgroundLayer(mountainsMedium);
let staticLayer2 = new StaticBackgroundLayer(mountainsNear);

let gradientLayer = {
	update: function () {},
	render: function () {
		ctx.save();
		let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		gradient.addColorStop(0, "aqua");
		gradient.addColorStop(1, "purple");
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
	},
};

let layers = [
	gradientLayer,
	layer0,
	staticLayer0,
	layer1,
	staticLayer1,
	layer2,
	staticLayer2,
	layer3,
];

class CountDownTimer {
	constructor() {
		this.x = canvas.width - 120;
		this.y = 70;
		this.timer = 60;
		this.lastUpdate = 0;

		this.countdownGradient = ctx.createLinearGradient(0, 0, 0, this.y);
		this.countdownGradient.addColorStop("0.4", "#fff");
		this.countdownGradient.addColorStop("0.5", "#000");
		this.countdownGradient.addColorStop("0.55", "#4040ff");
		this.countdownGradient.addColorStop("0.6", "#000");
		this.countdownGradient.addColorStop("0.9", "#fff");
	}

	update(deltaTime) {
		this.lastUpdate += deltaTime;
		if (this.lastUpdate >= 1000) {
			this.timer -= 1;
			this.lastUpdate = 0;
		}
		if (this.timer === 0) {
			scoreBoard.isGameOver = true;
		}
	}

	render() {
		ctx.save();
		ctx.fillStyle = this.countdownGradient;
		ctx.font = "90px Georgia";
		ctx.strokeText(this.timer, this.x, this.y);
		ctx.fillText(this.timer, this.x, this.y);
		ctx.restore();
	}
}

let countdown = new CountDownTimer();

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

	let gameObjects = [...layers, ...blocks, player, scoreBoard, countdown];

	gameObjects.forEach((object) => {
		object.update(changeInTime);
		object.render();
	});

	blocks = blocks.filter((b) => !b.isOffscreen && !b.isCaught);

	if (!scoreBoard.isGameOver) {
		requestAnimationFrame(gameLoop);
	}
}

requestAnimationFrame(gameLoop);
