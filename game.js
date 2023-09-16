import Player from "/player.js";
import Obstacle from "/obstacle.js";
import Egg from "/egg.js";
import Enemy from "/enemy.js";
import Heart from "/heart.js";

window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;
  ctx.fillStyle = "Black";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.font = "40px Bangers";
  ctx.textAlign = "center";

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.topMargin = 440;
      this.debug = true;
      this.player = new Player(this);
      this.fps = 70;
      this.timer = 0;
      this.interval = 1000 / this.fps;
      this.heartTimer = 0;
      this.heartInterval = 2000 + Math.random() * 6000;
      this.numberOfObstacles = 0;
      this.maxLivesToDisplay = 2; //This are the ones that will display randomly on the screen
      this.obstacles = [];
      this.hearts = [];
      this.enemies = [];
      this.hatchlings = [];
      this.particles = [];
      this.gameObject = [];
      this.timeElapsed = 0;
      this.zombieSpawnTimer = 0;
      this.zombieSpawnInterval = 20000;
      this.maxLives = 3;
      this.score = 0;
      this.maxScore = 0;
      this.gameOver = false;
      this.lostHatchlings = 0;
      this.mouse = {
        x: this.width - this.width * 0.8,
        y: this.height - 180,
        pressed: false,
      };

      // Play Music
      this.bgMusic = document.getElementById("bg-music");
      this.bgMusic.volume = 0.1;
      this.bgMusic.play();
      //Dead Audio
      this.bczombie = document.getElementById("bc-zombie");
      this.bczombie.volume = 0.5;

      Game.enableEventListeners();
    }
    //Event Listeners
    static handleMouseDown(e) {
      game.mouse.x = e.offsetX;
      game.mouse.y = e.offsetY;
      game.mouse.pressed = true;
    }

    static handleMouseUp(e) {
      game.mouse.x = e.offsetX;
      game.mouse.y = e.offsetY;
      game.mouse.pressed = false;
    }

    static handleMouseMove(e) {
      if (game.mouse.pressed) {
        game.mouse.x = e.offsetX;
        game.mouse.y = e.offsetY;
      }
    }

    static handleKeyDown(e) {
      if (e.key == "q") {
        game.debug = !game.debug;
      } else if (e.key == "r") {
        game.restart();
      }
    }

    static enableEventListeners() {
      canvas.addEventListener("mousedown", Game.handleMouseDown);
      canvas.addEventListener("mouseup", Game.handleMouseUp);
      canvas.addEventListener("mousemove", Game.handleMouseMove);
      window.addEventListener("keydown", Game.handleKeyDown);
    }

    static disableEventListeners() {
      canvas.removeEventListener("mousedown", Game.handleMouseDown);
      canvas.removeEventListener("mouseup", Game.handleMouseUp);
      canvas.removeEventListener("mousemove", Game.handleMouseMove);
    }

    render(context, deltaTime) {
      if (this.timer > this.interval) {
        context.clearRect(0, 0, this.width, this.height);
        this.gameObjects = [
          this.player,
          ...this.hearts,
          ...this.obstacles,
          ...this.enemies,
          ...this.hatchlings,
          ...this.particles,
        ];
        // Sort by Vertical position
        this.gameObjects.sort((a, b) => {
          return a.collisionY - b.collisionY;
        });
        this.gameObjects.forEach((object) => {
          object.draw(context);
          object.update(deltaTime);
        });
        this.timer = 0;
      }
      this.timer += deltaTime;

      // add lives periodically
      if (
        this.heartTimer > this.heartInterval &&
        this.hearts.length < this.maxLivesToDisplay &&
        !this.gameOver
      ) {
        this.addHearts();
        this.heartTimer = 0;
      } else {
        this.heartTimer += deltaTime;
      }

      this.zombieSpawnTimer += deltaTime;
      if (this.zombieSpawnTimer >= this.zombieSpawnInterval - 1500) {
        this.maxLivesToDisplay++;
      }
      if (this.zombieSpawnTimer >= this.zombieSpawnInterval) {
        this.addEnemy();
        this.zombieSpawnTimer = 0; // Reiniciar el temporizador
      }

      if (!this.gameOver) {
        this.timeElapsed += deltaTime;
        this.score = Math.floor(this.timeElapsed / 1000);
      }
      // Mostrar el tiempo transcurrido en el lienzo
      context.save();
      context.fillStyle = "rgba(0, 0, 0, 0.5)";
      context.textAlign = "left";
      context.font = "30px Bangers";
      context.fillText("Longest Survival Time: " + this.maxScore, 25, 50);
      context.fillText("Time Survived: " + this.score, 25, 100);
      context.fillText("Lives: ", 25, 150);
      const heartSymbol = "\u2665";
      let heartX = 100;
      const heartY = 150;

      for (let i = 0; i < this.maxLives; i++) {
        context.fillText(heartSymbol, heartX, heartY);
        heartX += 30;
      }
      context.restore();

      // Función para actualizar y mostrar el tiempo en segundos en el lienzo

      if (this.gameOver) {
        this.player.isZombie = true;
        Game.disableEventListeners();

        context.save();
        context.fillStyle = "rgba(0,0,0,0.5)";
        context.fillRect(0, 0, this.width, this.height);
        context.fillStyle = "white";
        context.textAlign = "center";
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;
        context.shadowColor = "black";
        let message = "You are a Zombie Now";
        context.font = "130px Bangers";
        context.fillText(message, this.width * 0.5, this.height * 0.5 );
        context.font = "40px Bangers";
        context.fillText(
          "Final Score " + this.score + " Press 'R' to survive again!",
          this.width * 0.5,
          this.height * 0.5 + 50
        );
        context.restore();

        if (this.score > this.maxScore) {
          this.maxScore = this.score;
        }

        this.bgMusic.pause();
      }
    }

    checkCollision(a, b) {
      const dx = a.collisionX - b.collisionX;
      const dy = a.collisionY - b.collisionY;
      const distance = Math.hypot(dy, dx);
      const sumOfRadio = a.collisionRadius + b.collisionRadius;
      return [distance < sumOfRadio, distance, sumOfRadio, dx, dy];
    }

    addHearts() {
      this.hearts.push(new Heart(this));
    }

    addEnemy() {
      this.enemies.push(new Enemy(this));
    }

    removeGameObject() {
      this.hearts = this.hearts.filter((object) => !object.markedForDeletion);
      this.hatchlings = this.hatchlings.filter(
        (object) => !object.markedForDeletion
      );
      this.particles = this.particles.filter(
        (object) => !object.markedForDeletion
      );
    }

    restart() {
      Game.enableEventListeners();
      this.player.isZombie = false;
      this.player.restart();
      this.obstacles = [];
      this.eggs = [];
      this.enemies = [];
      this.hatchlings = [];
      this.particles = [];
      this.timeElapsed = 0;
      this.score = 0;
      this.lostHatchlings = 0;
      this.gameOver = false;
      this.maxLives = 3;
      this.initObstacles();
      this.bgMusic.play();
    }

    initObstacles() {
      for (let i = 0; i < 10; i++) {
        this.addEnemy();
      }

      let attempts = 0;
      while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
        let testObstacle = new Obstacle(this);
        let overlap = false;
        this.obstacles.forEach((obstacle) => {
          const dx = testObstacle.collisionX - obstacle.collisionX;
          const dy = testObstacle.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dy, dx);
          const distanceBuffer = 150;
          const sumOfRadio =
            testObstacle.collisionRadius +
            obstacle.collisionRadius +
            distanceBuffer;
          if (distance < sumOfRadio) {
            overlap = true;
          }
        });
        const margin = testObstacle.collisionRadius * 3;
        if (
          !overlap &&
          testObstacle.spriteX > 0 &&
          testObstacle.spriteX < this.width - testObstacle.width &&
          testObstacle.collisionY > this.topMargin + margin &&
          testObstacle.collisionY < this.height - margin
        ) {
          this.obstacles.push(testObstacle);
        }
        attempts++;
      }
    }
  }

  const game = new Game(canvas);
  game.initObstacles();

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }
  animate(0); // In order to not get NaN
});
