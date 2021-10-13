const audioBadCatch = document.getElementById("audioBadCatch");
const audioGoodCatch = document.getElementById("audioGoodCatch");
const audioReduceScore = document.getElementById("audioReduceScore");
const audioWin = document.getElementById("audioWin");
const audioLose = document.getElementById("audioLose");

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
