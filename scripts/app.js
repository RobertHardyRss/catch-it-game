/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

class Block {
    constructor() {
        this.width = 32;
        this.height = this.width;
        this.x = Math.random() * canvas.width - this.width;
        this.y = 0 - this.height;  // off screen to start
        this.speed = Math.random() * 10 + 1;
    }
}


let myBlock = new Block();
console.log(myBlock);





// ctx.fillStyle = "red";
// let y = 0;
// function animate() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillRect(100, y, 100, 100);
//     y = y + 1;
//     requestAnimationFrame(animate);
// }

// animate();