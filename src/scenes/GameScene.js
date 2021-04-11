import {Scene, Math as pMath} from 'phaser';

class GameScene extends Scene {

  constructor() {
    super("scene-game");
  }

  create() {
    const lowerPadding = 50;
    this.monsterBody1 = this.physics.add.image(window.innerWidth * 0.25, window.innerHeight - lowerPadding - 100, 'monster-body');
    this.monsterBody1.body.setAllowGravity(false);
    this.monsterBody1.setOrigin(0.5, 0);
    this.monsterBody1.setTint(0xFF0000);
    this.monsterBody1.setDepth(1);

    this.monsterHead1 = this.add.sprite(window.innerWidth * 0.25 + 8, window.innerHeight - lowerPadding - this.monsterBody1.height + 20, 'monster-head');
    this.monsterHead1.setOrigin(0.5, 1);
    this.monsterHead1.play({ key: 'monster-bite', repeat: -1 });
    this.monsterHead1.setTint(0xFF0000);
    this.monsterHead1.setDepth(1);

    this.monsterBody2 = this.physics.add.image(window.innerWidth * 0.5, window.innerHeight - lowerPadding - 100, 'monster-body');
    this.monsterBody2.body.setAllowGravity(false);
    this.monsterBody2.setOrigin(0.5, 0);
    this.monsterBody2.setTint(0x00FF00);
    this.monsterBody2.setDepth(1);

    this.monsterHead2 = this.add.sprite(window.innerWidth * 0.5 + 8, window.innerHeight - lowerPadding - this.monsterBody1.height + 20, 'monster-head');
    this.monsterHead2.setOrigin(0.5, 1);
    this.monsterHead2.play({ key: 'monster-bite', repeat: -1 });
    this.monsterHead2.setTint(0x00FF00);
    this.monsterHead2.setDepth(1);

    this.monsterBody3 = this.physics.add.image(window.innerWidth * 0.75, window.innerHeight - lowerPadding - 100, 'monster-body');
    this.monsterBody3.body.setAllowGravity(false);
    this.monsterBody3.setOrigin(0.5, 0);
    this.monsterBody3.setTint(0x0000FF);
    this.monsterBody3.setDepth(1);

    this.monsterHead3 = this.add.sprite(window.innerWidth * 0.75 + 8, window.innerHeight - lowerPadding - this.monsterBody1.height + 20, 'monster-head');
    this.monsterHead3.setOrigin(0.5, 1);
    this.monsterHead3.play({ key: 'monster-bite', repeat: -1 });
    this.monsterHead3.setTint(0x0000FF);
    this.monsterHead3.setDepth(1);

    this.scoreText = this.add.text(window.innerWidth / 2, lowerPadding, 'Drag, drop, and match colours!', {
      fontSize: 24,
      fontFamily: 'sans-serif',
      color: '#000'
    });
    this.scoreText.setOrigin(0.5);

    const pukeParticles = this.add.particles('puke');
    pukeParticles.setDepth(0);

    this.puker = pukeParticles.createEmitter({
        x: window.innerWidth * 0.25 + 8,
        y: window.innerHeight - lowerPadding - this.monsterBody1.height,
        angle: { min: 250, max: 290 },
        speed: 400,
        gravityY: 200,
        lifespan: { min: 1000, max: 2000 },
        scale: { start: 1, end: 0 },
        quantity: 2,
        active: false
    });

    this.retryBtn = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - 100, 'retry-btn');
    this.retryBtn.setOrigin(0.5);
    this.retryBtn.setInteractive();
    this.retryBtn.setDepth(10);
    this.retryBtn.setVisible(false);

    this.retryBtn.on('pointerdown', () => {
      this.scene.restart();
    }, this);

    this.pies = [];
    this.delay = 3500;
    this.score = 0;
    this.isGameOver = false;

    this.time.addEvent({
      delay: this.delay,
      callback: this.spawnPieAndQueue,
      callbackScope: this,
      repeat: 0
    });

    this.input.addPointer();

    this.bgm = this.sound.add('music', {
      loop: true,
      volume: 0.5
    });
    this.bgm.play();

    this.cameras.main.setBackgroundColor(0xEF709D);
  }

  spawnPieAndQueue() {
    if (!this.isGameOver) {
      const column = pMath.Between(1, 3);
      const colourIndex = pMath.Between(1, 3);
      const x = (window.innerWidth * (column * 0.25));
      const pie = this.physics.add.image(x, -100, 'pie');

      pie.isGrabbed = false;
      pie.colourIndex = colourIndex;

      pie.setScale(0.5);
      pie.setDepth(0);

      this.physics.add.overlap(pie, this.monsterBody1, this.redEat, null, this);
      this.physics.add.overlap(pie, this.monsterBody2, this.greenEat, null, this);
      this.physics.add.overlap(pie, this.monsterBody3, this.blueEat, null, this);

      switch (colourIndex) {
        case 1:
          pie.setTint(0xFF0000);
          break;

        case 2:
          pie.setTint(0x00FF00);
          break;

        case 3:
          pie.setTint(0x0000FF);
          break;
      }

      pie.setInteractive();

      pie.on('pointerdown', () => {
        pie.isGrabbed = true;
      });

      pie.on('pointerup', () => {
        pie.isGrabbed = false;
      });

      pie.on('pointerupoutside', () => {
        pie.isGrabbed = false;
      });

      this.pies.push(pie);

      // Reduce delay and requeue function
      if (this.delay > 750) {
        this.delay -= 250;
      }

      this.time.addEvent({
        delay: this.delay,
        callback: this.spawnPieAndQueue,
        callbackScope: this,
        repeat: 0
      });
    }
  }

  redEat(pie, body) {
    const biteSfx = this.sound.add('sfx-bite');
    biteSfx.play();

    pie.destroy();
    if (pie.colourIndex === 1) {
      body.scale += 0.05;
      this.score++;
    }
    else {
      this.gameOver(1);
    }
  }

  greenEat(pie, body) {
    const biteSfx = this.sound.add('sfx-bite');
    biteSfx.play();

    pie.destroy();
    if (pie.colourIndex === 2) {
      body.scale += 0.05;
      this.score++;
    }
    else {
      this.gameOver(2);
    }
  }

  blueEat(pie, body) {
    const biteSfx = this.sound.add('sfx-bite');
    biteSfx.play();

    pie.destroy();
    if (pie.colourIndex === 3) {
      body.scale += 0.05;
      this.score++;
    }
    else {
      this.gameOver(3);
    }
  }

  gameOver(colourIndex) {
    this.bgm.stop();
    const deathSfx = this.sound.add('sfx-death');
    deathSfx.play();

    this.retryBtn.setVisible(true);
    this.isGameOver = true;
    this.pies.forEach((pie) => {
      pie.destroy();
    });

    if (colourIndex === 1) {
      this.monsterHead1.play({ key: 'monster-spew', repeat: -1 });

      this.puker.setPosition(this.monsterHead1.x, this.monsterHead1.y - 30);
      this.puker.resume();
      
      this.tweens.add({
        targets: [this.monsterHead2, this.monsterBody2, this.monsterHead3, this.monsterBody3],
        y: window.innerHeight + 300,
        duration: 2000,
        ease: 'Linear'
      });
    }
    else if (colourIndex === 2) {
      this.monsterHead2.play({ key: 'monster-spew', repeat: -1 });

      this.puker.setPosition(this.monsterHead2.x, this.monsterHead2.y - 30);
      this.puker.resume();

      this.tweens.add({
        targets: [this.monsterHead1, this.monsterBody1, this.monsterHead3, this.monsterBody3],
        y: window.innerHeight + 300,
        duration: 2000,
        ease: 'Linear'
      });
      
    }
    else if (colourIndex === 3) {
      this.monsterHead3.play({ key: 'monster-spew', repeat: -1 });

      this.puker.setPosition(this.monsterHead3.x, this.monsterHead3.y - 30);
      this.puker.resume();
      
      this.tweens.add({
        targets: [this.monsterHead1, this.monsterBody1, this.monsterHead2, this.monsterBody2],
        y: window.innerHeight + 300,
        duration: 2000,
        ease: 'Linear'
      });
    }
  }

  update() {
    const {activePointer} = this.input;

    this.pies.forEach((pie) => {
      if (pie.isGrabbed) {
        pie.setPosition(activePointer.x, activePointer.y);
      }
    });

    if (this.score > 0) {
      this.scoreText.setStyle({
        fontSize: 40
      });
      this.scoreText.setText(this.score);
    }
  }

}
export default GameScene;