import Phaser from 'phaser'

import HelloWorldScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: [HelloWorldScene]
}

export default new Phaser.Game(config)
