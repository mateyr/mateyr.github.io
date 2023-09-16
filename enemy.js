export default class Enemy {
  constructor(game) {
    this.game = game;
    this.collisionRadius = 25;
    this.speeX = Math.random() * 3 + 0.5;
    this.image = document.getElementById("toads");
    this.spriteWidth = 185;
    this.spriteHeight = 201;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.collisionX =
      this.game.width + this.width + Math.random() * this.game.width * 0.5 + 20;
    this.collisionY =
      this.game.topMargin +
      Math.random() * (this.game.height - this.game.topMargin + 200);
    this.spriteX;
    this.spriteY;
    this.frameX = 9;
    this.frameY = 0;
    this.collisionWithPlayer = false;
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2
      );
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
    }
  }

  update() {
    this.spriteX = this.collisionX - this.width * 0.5 - 20;
    this.spriteY = this.collisionY - this.height * 0.5 - 10;

    this.collisionX -= this.speeX;
    if (this.spriteX + this.width < 0 && !this.game.gameOver) {
      this.collisionX =
        this.game.width + this.width + Math.random() * this.game.width * 0.5;
      this.collisionY =
        this.game.topMargin +
        20 +
        Math.random() * (this.game.height - this.game.topMargin);
    }

    const frameIndex = Math.floor((this.collisionX / this.game.width) * 7); // Suponiendo que hay 7 fotogramas
    this.frameX = frameIndex % 7;

    //Vertical Boundaries
    if (this.collisionY < this.collisionRadius + this.game.topMargin)
      this.collisionY = this.game.topMargin + this.collisionRadius;
    else if (this.collisionY > this.game.height - this.collisionRadius - 60) {
      this.collisionY = this.game.height - this.collisionRadius - 60;
    }

    //Collision with Player
    let collisionObjects = [this.game.player];
    collisionObjects.forEach((object) => {
      let [collision, distance, sumOfRadio, dx, dy] = this.game.checkCollision(
        this,
        object
      );
      if (collision) {

        if(this.game.maxLives === 0){
          this.game.gameOver = true;
        }

        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = object.collisionX + (sumOfRadio + 1) * unit_x;
        this.collisionY = object.collisionY + (sumOfRadio + 1) * unit_y;

        if (!this.collisionWithPlayer) {
          this.collisionWithPlayer = true;
          if (this.game.maxLives > 0 ){
            this.game.maxLives--;
          }
        }
      }
    });
  }
}
