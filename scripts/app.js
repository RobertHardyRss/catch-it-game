/// <reference path="player.js" />
/// <reference path="scoreboard.js" />
/// <reference path="block.js" />
/// <reference path="background-layers.js" />
/// <reference path="timer.js" />

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
