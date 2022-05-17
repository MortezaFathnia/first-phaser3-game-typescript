import Phaser from "phaser";

export default class BombSpawner {
    private _group: Phaser.Physics.Arcade.Group;
    private key: string;
    private scene: Phaser.Scene;
    constructor(scene, bombKey = 'bomb') {
        this.scene = scene;
        this.key = bombKey;
        this._group = this.scene.physics.add.group()
    }

    get group() {
        return this._group;
    }

    Spawn(playerX = 0) {
        const x = (playerX < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        const bomb = this.group.create(x, 16, this.key);

        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        return bomb
    }
}