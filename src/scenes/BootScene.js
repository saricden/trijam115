import {Scene} from 'phaser';

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  
  preload() {
    // Load any assets here from your assets directory
    this.load.image('monster-body', 'assets/monster-body.png');
    this.load.aseprite('monster-head', 'assets/monster-head.png', 'assets/monster-head.json');

    this.load.image('pie', 'assets/pie.png');
    this.load.image('puke', 'assets/puke.png');
    this.load.image('retry-btn', 'assets/retry-btn.png');

    this.load.audio('sfx-bite', 'assets/bite.mp3');
    this.load.audio('sfx-death', 'assets/death.mp3');
    this.load.audio('music', 'assets/never-back-down.mp3');
  }

  create() {
    this.anims.createFromAseprite('monster-head');

    this.scene.start('scene-game');
  }
}

export default BootScene;