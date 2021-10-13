/// <reference path="constants.js" />

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
