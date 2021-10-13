/// <reference path="scoreboard.js" />

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
