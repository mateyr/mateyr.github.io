import Larva from '/larva.js';

export default class Egg {
  constructor(game) {
    this.game = game;
    this.collisionRadius = 40;
    this.margin = this.collisionRadius * 2;
    this.collisionX =
      this.margin + Math.random() * (this.game.width - this.margin * 2);
    this.collisionY =
      this.game.topMargin +
      Math.random() * (this.game.height - this.game.topMargin - this.margin);
    this.image = document.getElementById("egg");
    this.spriteWidth = 110;
    this.spriteHeight = 135;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX;
    this.spriteY;
    this.hatchTimer = 0;
    this.harchInterval = 10000;
    this.markedForDeletion = false;
  }

  draw(context) {
    context.drawImage(this.image, this.spriteX, this.spriteY);
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
      const displayTimer = (this.hatchTimer * 0.001).toFixed(0);
      context.fillText(
        displayTimer,
        this.collisionX,
        this.collisionY - this.collisionRadius * 2.5
      );
    }
  }

  update(deltaTime) {
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 30;
    let collisionObjects = [
      this.game.player,
      ...this.game.obstacles,
      ...this.game.enemies,
    ];
    collisionObjects.forEach((object) => {
      let [collision, distance, sumOfRadio, dx, dy] = this.game.checkCollision(
        this,
        object
      );
      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = object.collisionX + (sumOfRadio + 1) * unit_x;
        this.collisionY = object.collisionY + (sumOfRadio + 1) * unit_y;
      }
    });

    // Hatching

    if (
      this.hatchTimer > this.harchInterval ||
      this.collisionY < this.game.topMargin
    ) {
      this.game.hatchlings.push(
        new Larva(this.game, this.collisionX, this.collisionY)
      );
      this.markedForDeletion = true;
      this.game.removeGameObject();
    } else {
      this.hatchTimer += deltaTime;
    }
  }
}
