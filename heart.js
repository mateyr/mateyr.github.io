export default class Heart {
  constructor(game) {
    this.game = game;
    this.collisionRadius = 10;
    this.margin = this.collisionRadius * 2;
    this.collisionX =
      this.margin + Math.random() * (this.game.width - this.margin * 2);
    /*this.collisionX = Math.random() * this.game.width;*/
    this.collisionY =
      this.game.topMargin +
      80 +
      Math.random() *
        (this.game.height - this.game.topMargin - (this.margin + 120));
    this.spriteWidth = 32;
    this.spriteHeight = 32;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX;
    this.spriteY;
    this.heartTimer = 0;
    this.heartInterval = 10000;
    this.image = document.getElementById("live");
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
      const displayTimer = (this.heartTimer * 0.001).toFixed(0);
      context.fillText(
        displayTimer,
        this.collisionX,
        this.collisionY - this.collisionRadius * 2.5
      );
    }
  }

  update(deltaTime) {
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;
    let collisionObjects = [...this.game.enemies];
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

        this.markedForDeletion = true;
        this.game.removeGameObject();
      }
    });

    // Collision with Player
    let collision = this.game.checkCollision(this, this.game.player)[0];
    if (collision) {
      this.markedForDeletion = true;

      if (this.game.maxLives < 3) {
        this.game.maxLives++;
      }

      this.game.removeGameObject();
    }

    if (this.heartTimer > this.heartInterval) {
      this.markedForDeletion = true;
      this.game.removeGameObject();
    } else {
      this.heartTimer += deltaTime;
    }
  }
}
