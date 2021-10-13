/// <reference path="constants.js" />
/// <reference path="scoreboard.js" />

let goodBlockRatio = 0.25;
let blockSpawnRate = 500;

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

let blocks = [new Block()];
