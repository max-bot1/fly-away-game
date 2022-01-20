(() => {
  function preload() {
    this.load.image("sky1", "assets/sky1.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("ship", "assets/ship.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  function create() {
    this.add.image(400, 300, "sky1");

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, "ground").setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 250, "ship");

    player.setBounce(0.2);
    player.body.setGravityY(0);
    player.body.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.sprite(400, 250, "star");

    scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(stars, player, collectStars, null, this);

    this.physics.add.collider(player, platforms, dead, null, this);
  }

  function update() {
    if (cursors.left.isDown) {
      player.setVelocityX(-300);
    } else if (cursors.right.isDown) {
      player.setVelocityX(300);
    } else {
      player.setVelocityX(0);
    }
    if (cursors.up.isDown) {
      player.setVelocityY(-300);
    } else if (cursors.down.isDown) {
      player.setVelocityY(300);
    } else {
      player.setVelocityY(0);
    }

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
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    stars.enableBody(true, x, Phaser.Math.Between(20, 400), true, true);
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

  var game = new Phaser.Game(config);
})();
