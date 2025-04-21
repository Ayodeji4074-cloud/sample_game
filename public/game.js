const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let player1, player2, tree, oxygenBubble;
let p1CO2 = 0, p2CO2 = 0;
let p1O2 = 0, p2O2 = 0;
let co2Released = false;
let oxygenAvailable = false;
let oxygenTimer;
let background;
let p1Key, p2Key;
let oxygenSound, co2Sound;
let scoreText, timerText;
let gameOver = false;
let timeLeft = 60;

function preload() {
  this.load.image('background', 'assets/bg_kid_friendly.jpg');
  this.load.image('tree', 'assets/tree.jpg');
  this.load.image('player1', 'assets/player1.jpg');
  this.load.image('player2', 'assets/player2.jpg');
  this.load.image('oxygen', 'assets/oxygen.jpg');
  this.load.audio('oxygenSound', 'assets/sfx/oxygen.mp3');
  this.load.audio('co2Sound', 'assets/sfx/co2.mp3');
}

function create() {
  const centerX = this.sys.game.config.width / 2;
  const centerY = this.sys.game.config.height / 2;

  background = this.add.image(0, 0, 'background')
    .setOrigin(0)
    .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

  tree = this.add.image(centerX, centerY - 200, 'tree').setScale(0.3);
  player1 = this.add.image(centerX - 200, centerY + 100, 'player1').setScale(0.3);
  player2 = this.add.image(centerX + 200, centerY + 100, 'player2').setScale(0.3);

  oxygenSound = this.sound.add('oxygenSound');
  co2Sound = this.sound.add('co2Sound');

  scoreText = this.add.text(20, 20, '', { fontSize: '18px', fill: '#fff' });
  timerText = this.add.text(this.sys.game.config.width - 150, 20, `Time: ${timeLeft}s`, { fontSize: '18px', fill: '#fff' });

  p1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  p2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

  oxygenTimer = this.time.addEvent({
    delay: 5000,
    callback: releaseOxygen,
    callbackScope: this,
    loop: true
  });
}

function update() {
  if (gameOver) return;

  if (Phaser.Input.Keyboard.JustDown(p1Key)) {
    co2Released = true;
    p1CO2++;
    co2Sound.play();
    if (oxygenAvailable) {
      p1O2++;
      oxygenAvailable = false;
      if (oxygenBubble) oxygenBubble.destroy();
      oxygenSound.play();
    }
  }

  if (Phaser.Input.Keyboard.JustDown(p2Key)) {
    co2Released = true;
    p2CO2++;
    co2Sound.play();
    if (oxygenAvailable) {
      p2O2++;
      oxygenAvailable = false;
      if (oxygenBubble) oxygenBubble.destroy();
      oxygenSound.play();
    }
  }

  scoreText.setText(`Player 1 - CO₂: ${p1CO2} O₂: ${p1O2} | Player 2 - CO₂: ${p2CO2} O₂: ${p2O2}`);

  if (timeLeft > 0) {
    timeLeft -= 1 / 60;
    timerText.setText(`Time: ${Math.ceil(timeLeft)}s`);
  } else if (!gameOver) {
    endGame(this);
  }
}

function releaseOxygen() {
  if (oxygenBubble) oxygenBubble.destroy();
  oxygenAvailable = true;
  oxygenBubble = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 100, 'oxygen').setScale(0.1);
}

function endGame(scene) {
  gameOver = true;
  const winner = p1O2 > p2O2 ? "🎉 Player 1 Wins!" :
                 p2O2 > p1O2 ? "🎉 Player 2 Wins!" : "🤝 It's a Tie!";

  const style = { font: '32px Comic Sans MS', fill: '#ffeb3b', backgroundColor: '#263238', padding: 10 };
  const winnerText = scene.add.text(scene.sys.game.config.width / 2, scene.sys.game.config.height / 2, winner, style)
    .setOrigin(0.5);

  scene.tweens.add({
    targets: winnerText,
    scale: { from: 0.5, to: 1.2 },
    yoyo: true,
    repeat: -1,
    ease: 'Bounce',
    duration: 600
  });
}
