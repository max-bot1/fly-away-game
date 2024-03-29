(() => {
  function preload() {
    this.load.image("pixelSky", "assets/pixelSky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("ship", "assets/ship.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  function create() {
    background = this.add.tileSprite(
      400,
      300,
      config.width,
      config.height,
      "pixelSky"
    );

    platforms = this.physics.add.staticGroup();

    player = this.physics.add.sprite(100, 250, "ship");

    player.setBounce(0.2);
    player.body.setCollideWorldBounds(true);
    player.body.setSize(25, 21);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.sprite(400, 250, "star");

    scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    highscoreText = this.add.text(500, 16, "High Score: " + highScore, {
      fontSize: "32px",
      fill: "#000",
    });

    bombs = this.physics.add.group();

    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(stars, player, collectStars, null, this);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bombs, player, dead, null, this);

    this.physics.add.collider(player, platforms, dead, null, this);
  }

  function update() {
    background.tilePositionX += 3;

    let direction = new Phaser.Math.Vector2(0, 0);

    if (cursors.up.isDown) {
      direction.y += -1;
    }

    if (cursors.down.isDown) {
      direction.y += 1;
    }

    if (cursors.left.isDown) {
      direction.x += -1;
    }

    if (cursors.right.isDown) {
      direction.x += 1;
    }

    direction.normalize();

    const speed = 600;

    player.setVelocity(direction.x * speed, direction.y * speed);

    if (cursors.space.isDown) {
      this.scene.restart();
      gameOver = false;
      score = 0;
      scoreText.setText("Score: " + score);
    }
  }

  const collectStars = () => {
    stars.disableBody(true, true);

    score += 10;
    scoreText.setText("Score: " + score);

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 740)
        : Phaser.Math.Between(20, 400);

    var y = player.y < 300 ? 580 : 16;

    stars.enableBody(true, x, Phaser.Math.Between(60, 520), true, true);

    if (score % 50 === 0) {
      const bombNum = score / 100;

      var bomb = bombs.create(x, y, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);

      bomb.setVelocity(Phaser.Math.Between(-300, 300), 200);
      bomb.allowGravity = false;
    }
  };

  function dead(player, ground) {
    var restartText = ["You have Died", "Press Spacebar to Restart"];

    this.physics.pause();

    player.setTint(0x000000);

    gameOver = true;

    this.add.text(200, 250, restartText, {
      font: "40px Times New Roman",
      fill: "#000000",
      align: "center",
    });

    if (score > highScore) {
      highScore = score;
    }
  }
  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
      arcade: {
        // gravity: { y: 300 },
        debug: false,
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };

  var player;
  var platforms;
  var cursors;
  var gameOver;
  var stars;
  var bombs;
  var score = 0;
  var scoreText;
  var highScore = 0;
  var highScoreText;

  var game = new Phaser.Game(config);
})();
