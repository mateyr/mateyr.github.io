/*export default class Player {
  constructor(game) {
    this.game = game;
    this.collisionX = 20;
    this.collisionY = 20;
    this.collisionRadius = 20;
    this.speedX = 0;
    this.speedY = 0;
    this.dx = 0; // distance
    this.dy = 0;
    this.speedModifier = 3;
    this.spriteWidth = 150;
    this.spriteHeight = 195;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX;
    this.spriteY;
    this.frameX = 3;
    this.frameY = 1;
    this.isZombie = false;
    this.zombieFrameIndex = 0;
    this.image = document.getElementById("player");

    //Dead Zombies Imagenes

    this.zombieFrames = [
      document.getElementById("dead1"),
      document.getElementById("dead2"),
      document.getElementById("dead3"),
      document.getElementById("dead4"),
      document.getElementById("dead5"),
      document.getElementById("dead6"),
      document.getElementById("dead7"),
      document.getElementById("dead8")
    ];

  }

  restart() {
    this.collisionX = 20;
    this.collisionY = 20;

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 100;
  }

  draw(context) {

    if(this.isZombie){
      const zombieFrame = this.zombieFrames[this.zombieFrameIndex];
      context.drawImage(
        zombieFrame,
        this.spriteX,
        this.spriteY,
        100,
        193
      ); 
    }else{
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
    }

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
      context.beginPath();
      context.moveTo(this.collisionX, this.collisionY);
      context.lineTo(this.game.mouse.x, this.game.mouse.y);
      context.stroke();
    }
  }

  update() {
    this.dx = this.game.mouse.x - this.collisionX;
    this.dy = this.game.mouse.y - this.collisionY;

    //Sprite Animatio
    const distance = Math.hypot(this.dy, this.dx);

    if (distance > this.collisionRadius) {
      const frameCount = 3; // Cantidad total de fotogramas en la secuencia
      const frameIndex =
        Math.floor(distance / this.collisionRadius) % frameCount;
      this.frameX = frameIndex;
    } else {
      // El jugador está cerca o en el objetivo
      this.frameX = 3; // Fotograma cuando el jugador está en el objetivo
    }

    if (distance > this.speedModifier) {
      this.speedX = this.dx / distance || 0;
      this.speedY = this.dy / distance || 0;
    } else {
      this.speedX = 0;
      this.speedY = 0;
    }

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;

    //Horizonta Boundaries
    if (this.collisionX < this.collisionRadius)
      this.collisionX = this.collisionRadius;
    else if (this.collisionX > this.game.width - this.collisionRadius) {
      this.collisionX = this.game.width - this.collisionRadius;
    }
    //Vertical Boundaries
    if (this.collisionY < this.collisionRadius + this.game.topMargin)
      this.collisionY = this.game.topMargin + this.collisionRadius;
    else if (this.collisionY > this.game.height - this.collisionRadius - 70) {
      this.collisionY = this.game.height - this.collisionRadius - 70;
    }

    // Collision with obstacles
    this.game.enemies.forEach((enemy) => {
      let [collision, distance, sumOfRadio, dx, dy] = this.game.checkCollision(
        this,
        enemy
      ); //Destructuring Assignment
      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = enemy.collisionX + (sumOfRadio + 1) * unit_x;
        this.collisionY = enemy.collisionY + (sumOfRadio + 1) * unit_y;
      }
    });

  }
}*/

export default class Player {
  constructor(game) {
    this.game = game;
    this.collisionX = 20;
    this.collisionY = 20;
    this.collisionRadius = 20;
    this.speedX = 0;
    this.speedY = 0;
    this.dx = 0; // distance
    this.dy = 0;
    this.speedModifier = 3;
    this.spriteWidth = 150;
    this.spriteHeight = 195;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX;
    this.spriteY;
    this.frameX = 3;
    this.frameY = 1;
    this.isZombie = false;
    this.zombieFrameIndex = 0;
    this.image = document.getElementById("player");

    //Dead Zombies Imagenes

    // Definir un array de objetos para las imágenes de zombie
    this.zombieFrames = [
      { image: document.getElementById("dead1"), width: 100, height: 195 },
      { image: document.getElementById("dead2"), width: 130, height: 195 },
      { image: document.getElementById("dead3"), width: 170, height: 180 },
      { image: document.getElementById("dead4"), width: 190, height: 135 },
      { image: document.getElementById("dead5"), width: 180, height: 114 },
      { image: document.getElementById("dead6"), width: 180, height: 64 },
      { image: document.getElementById("dead7"), width: 180, height: 60 },
      { image: document.getElementById("dead8"), width: 180, height: 67},
    ];

    this.zombieFrameCount = this.zombieFrames.length;
    this.zombieFrameIndex = 0;
    this.zombieFrameInterval = 200; // Intervalo de tiempo en milisegundos entre cambios de imagen de zombie
    this.zombieFrameTimer = 0; // Temporizador para controlar el cambio de imagen de zombie
    this.zombieFallSpeed = 2; // Velocidad de caída del jugador zombie
    this.isFalling = false;
  }

  restart() {
    this.collisionX = 20;
    this.collisionY = 20;

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 100;

    this.zombieFrameIndex = 0;
    this.isFalling = false;

    this.width  = this.spriteWidth;
    this.height = this.spriteHeight;
  }

  draw(context) {
    if (this.isZombie) { 
      const zombieFrame = this.zombieFrames[this.zombieFrameIndex];
      this.width = zombieFrame.width;
      this.height = zombieFrame.height
      context.drawImage(
        zombieFrame.image , 
        this.spriteX,
        this.spriteY,
        this.width, 
        this.height);
    } else {
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
    }

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
      context.beginPath();
      context.moveTo(this.collisionX, this.collisionY);
      context.lineTo(this.game.mouse.x, this.game.mouse.y);
      context.stroke();
    }
  }

  // Método para activar el efecto de caída del jugador zombie
  startFalling() {
    this.isFalling = true;
  }

  update(deltaTime) {
    this.dx = this.game.mouse.x - this.collisionX;
    this.dy = this.game.mouse.y - this.collisionY;

    //Sprite Animatio
    const distance = Math.hypot(this.dy, this.dx);

    if (this.isZombie) {
      // Si el jugador ha alcanzado el último frame de la animación de zombie, detener la animación y activar la caída
      if (this.zombieFrameIndex === this.zombieFrameCount - 1) {
        this.isFalling = true;
        this.zombieFrameTimer = 0; // Reiniciar el temporizador para evitar la transición repetida del último frame
      }

      // Solo actualizar la animación de zombie si el jugador no ha alcanzado el último frame
      if (!this.isFalling) {
        // Actualizar el temporizador de la animación de zombie
        this.zombieFrameTimer += deltaTime;

        // Cambiar a la siguiente imagen de zombie cuando se alcanza el intervalo de tiempo
        if (this.zombieFrameTimer >= this.zombieFrameInterval) {
          this.zombieFrameIndex =
            (this.zombieFrameIndex + 1) % this.zombieFrameCount;
          this.zombieFrameTimer = 0; // Reiniciar el temporizador
        }
      }
    }

    if (distance > this.collisionRadius) {
      const frameCount = 3; // Cantidad total de fotogramas en la secuencia
      const frameIndex =
        Math.floor(distance / this.collisionRadius) % frameCount;
      this.frameX = frameIndex;
    } else {
      // El jugador está cerca o en el objetivo
      this.frameX = 3; // Fotograma cuando el jugador está en el objetivo
    }

    if (distance > this.speedModifier) {
      this.speedX = this.dx / distance || 0;
      this.speedY = this.dy / distance || 0;
    } else {
      this.speedX = 0;
      this.speedY = 0;
    }

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;

    //Horizonta Boundaries
    if (this.collisionX < this.collisionRadius)
      this.collisionX = this.collisionRadius;
    else if (this.collisionX > this.game.width - this.collisionRadius) {
      this.collisionX = this.game.width - this.collisionRadius;
    }
    //Vertical Boundaries
    if (this.collisionY < this.collisionRadius + this.game.topMargin)
      this.collisionY = this.game.topMargin + this.collisionRadius;
    else if (this.collisionY > this.game.height - this.collisionRadius - 70) {
      this.collisionY = this.game.height - this.collisionRadius - 70;
    }

    // Collision with obstacles
    this.game.enemies.forEach((enemy) => {
      let [collision, distance, sumOfRadio, dx, dy] = this.game.checkCollision(
        this,
        enemy
      ); //Destructuring Assignment
      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = enemy.collisionX + (sumOfRadio + 1) * unit_x;
        this.collisionY = enemy.collisionY + (sumOfRadio + 1) * unit_y;
      }
    });
  }
}
