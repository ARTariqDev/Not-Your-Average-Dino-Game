import Phaser from 'phaser';

class BeginningScene extends Phaser.Scene {
    constructor() {
        super('BeginningScene');
    }

    preload() {
        this.load.spritesheet('dino_sheet', 'assets/dino_sprites.png', {
            frameWidth: 44,
            frameHeight: 50
        });
        this.load.image('ground_sheet', 'assets/ground.png'); //changing ts to a simple image instead of spritesheet
    }

    create() {
        // Set bg color to white (for now)
        this.cameras.main.setBackgroundColor('#ffffff');

        // dino animation
        this.anims.create({
            key: 'dino_run',
            frames: this.anims.generateFrameNumbers('dino_sheet', { start: 0, end: 3 }),
            frameRate: 17,
            repeat: -1
        });

        // Add Ground as a TileSprite
        this.ground = this.add.tileSprite(
            this.scale.width / 2, // Center X
            320,                  // Y position
            this.scale.width,     // Width matches screen exactly
            12,                   // Height of texture
            'ground_sheet'
        );

        // Add the sprite at X: 400, Y: 300 using frame 0
        let dino = this.add.sprite(200, 300, 'dino_sheet', 0);

        let isJumping = false;

        this.input.keyboard.on('keydown-SPACE', () => {
            if (!isJumping) {
                isJumping = true; // to prevent mid air space bar spam
                dino.stop();
                dino.setFrame(0);
                this.tweens.add({
                    targets: dino,
                    y: dino.y - 100, // Jump height
                    duration: 300, // Jump duration (in miliseconds)
                    ease: 'Power2',
                    yoyo: true, // Return to original position
                    onComplete: () => {
                        isJumping = false;
                        dino.play('dino_run'); // resume animation
                    }
                });
            }
        });

        // Play the animation
        dino.play('dino_run');
    }

    update() {
        // Shift the ground pattern left by 6 pixels every single frame
        this.ground.tilePositionX += 6;
    }
}

// config + physics stuff
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'app',
        width: '100%',
        height: '100%',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false //can be changhed later when we add physics
        }
    },
    scene: [BeginningScene]
};

new Phaser.Game(config);