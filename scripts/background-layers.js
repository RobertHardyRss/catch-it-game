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
cloudsFar.src = "images/clouds-far.png";
let cloudsMedium = new Image();
cloudsMedium.src = "images/clouds-medium.png";
let cloudsNear = new Image();
cloudsNear.src = "images/clouds-near.png";
let cloudsClose = new Image();
cloudsClose.src = "images/clouds-close.png";

let mountainsFar = new Image();
mountainsFar.src = "images/mountains-far.png";
let mountainsMedium = new Image();
mountainsMedium.src = "images/mountains-medium.png";
let mountainsNear = new Image();
mountainsNear.src = "images/mountains-near.png";

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

const layers = [
	gradientLayer,
	layer0,
	staticLayer0,
	layer1,
	staticLayer1,
	layer2,
	staticLayer2,
	layer3,
];
