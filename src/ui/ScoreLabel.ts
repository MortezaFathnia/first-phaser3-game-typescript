import Phaser from "phaser";

const formatScore = (score) => `Score: ${score}`

export default class ScoreLabel extends Phaser.GameObjects.Text {
    private score = 0;
    private scoreText?: Phaser.GameObjects.Text;

    constructor(scene, x, y, score, style) {
        super(scene, x, y, formatScore(score), style);
        this.score = score;
    }

    setScore(score:number) {
        this.score = score;
        this.updateScoreText();
    }

    add(points:number) {
        this.setScore(this.score + points)
    }

    updateScoreText() {
        this.setText(formatScore(this.score))
    }
}