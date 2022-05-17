import Phaser from 'phaser'
import ScoreLabel from "../ui/ScoreLabel";
import BombSpawner from "./BombSpawner";

const GROUND_KEY = 'ground';
const DUDE_KEY = 'dude';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';

export default class GameScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private stars?: Phaser.Physics.Arcade.Group;


    private scoreLabel?: ScoreLabel;

    private bombSpawner?: BombSpawner;

    private gameOver = false;

    constructor() {
        super('game-scene');
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image(GROUND_KEY, 'assets/platform.png');
        this.load.image(STAR_KEY, 'assets/star.png');
        this.load.image(BOMB_KEY, 'assets/bomb.png');

        this.load.spritesheet(DUDE_KEY, 'assets/dude.png', { frameWidth: 32, frameHeight: 48 })
    }

    create() {
        this.add.image(400, 300, 'sky');
        this.platforms = this.createPlatforms();
        this.player = this.createPlayer();
        this.stars = this.createStars();
        this.scoreLabel = this.createScoreLabel(16, 16, 0);
        this.bombSpawner = new BombSpawner(this, BOMB_KEY)
		const bombsGroup = this.bombSpawner.group;

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.handleCollectStar, undefined, this);
        this.physics.add.collider(bombsGroup, this.platforms);
        this.physics.add.collider(this.player, bombsGroup, this.handleHitBomb, undefined, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    private createPlatforms() {
        const platforms = this.physics.add.staticGroup();
        const ground = platforms.create(400, 568, GROUND_KEY) as Phaser.Physics.Arcade.Sprite;
        ground.setScale(2).refreshBody();

        platforms.create(600, 400, GROUND_KEY);
        platforms.create(50, 250, GROUND_KEY);
        platforms.create(750, 220, GROUND_KEY);
        return platforms;
    }

    private createPlayer() {
        const player = this.physics.add.sprite(100, 450, DUDE_KEY);
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, {
                start: 0, end: 3
            }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'turn',
            frames: [{ key: DUDE_KEY, frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, {
                start: 5, end: 8
            }),
            frameRate: 10,
            repeat: -1
        });

        return player;
    }

    private createStars() {
        const stars = this.physics.add.group({
            key: STAR_KEY,
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Image;

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        });

        return stars;
    }

    createScoreLabel(x: number, y: number, score: number) {
        const style = { fontSize: '32px', fill: '#000' }
        const label = new ScoreLabel(this, x, y, score, style);

        this.add.existing(label);

        return label;
    }

    private handleHitBomb(player: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject) {
        this.physics.pause();

        this.player?.setTint(0xff0000);

        this.player?.anims.play('turn');
        this.gameOver = true;
    }

    private handleCollectStar(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject) {
        const star = s as Phaser.Physics.Arcade.Image;
        star.disableBody(true, true);

        this.scoreLabel?.add(10);

        if (this.stars?.countActive(true) === 0) {
            this.stars.children.iterate(c => {
                const child = c as Phaser.Physics.Arcade.Image;
                child.enableBody(true, child.x, 0, true, true);
            });
        }
        if (this.player) {
            this.bombSpawner?.Spawn(this.player.x)
        }
    }

    update() {
        if (!this.cursors) {
            return
        }
        if (this.cursors.left.isDown) {
            this.player?.setVelocityX(-160);
            this.player?.anims.play('left', true)
        }
        else if (this.cursors.right.isDown) {
            this.player?.setVelocityX(160);
            this.player?.anims.play('right', true)
        }
        else {
            this.player?.setVelocityX(0);
            this.player?.anims.play('turn');
        }

        if (this.cursors.up?.isDown && this.player?.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
}
