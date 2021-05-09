const FPS = 45;
const inputDelay = 0;
const w = this.innerWidth;
const h = this.innerHeight;
const mapSize = 13;
const defaultCameraZoom = 0.9 * this.innerHeight / 1000;
const controlPanle = 0.65;
const controlMode = 1
const startDiff = 60;
const endDiff = 5;
const diffTimeScale = 120;
const lookFreq = 0.01;

let keyboard;
const xVector = new Phaser.Math.Vector2(100 * Math.sqrt(2) / 8 * 2.5, -(100 * Math.sqrt(2) / 8 * 2.5) / Math.sqrt(3));
const yVector = new Phaser.Math.Vector2(-100 * Math.sqrt(2) / 8 * 2.5, -(100 * Math.sqrt(2) / 8 * 2.5) / Math.sqrt(3));
var playerPos = new Phaser.Math.Vector2(10, (mapSize - 1) / 2);
var CameraPos = new Phaser.Math.Vector2(10, (mapSize - 1) / 2);
var preCamPos = new Phaser.Math.Vector2(10, (mapSize - 1) / 2);
var PlayerUIPos = new Phaser.Math.Vector2(10, (mapSize - 1) / 2);
var cameraZoom = defaultCameraZoom;
let playerPosture = 0;
const aniFrame = 10;
const aniTime = aniFrame / FPS;
var timeCount = aniTime;
var nextInput = -1;
var blocks = [];
var booms = [];
var x2s = 0;
var Score = 0;
var displayScore = 0;
var power = startDiff;
var currentDiff = startDiff;
var gameTime = 0;
var blockSpawnTime = 0.02;
var blockSpawnTimeCount = 0;
var X2SpawnTime = 20;
var X2SpawnTimeCount = 0;
var playerDying = false;
var playerDied = false;
var howToDie = 0;
var afterLife = 0;
var endTime = -1;
var realAfterLife = 0;
var afterLifeHigh = 0;
var afterLifeZero = 0;
var lookcount = 0;
var combo = 1;
var comboTimeCount = 0;

const comboTime = 3.5;
const maxBoomNum = 25;
const maxBlockNum = 120;
const maxX2Num = 1;
const newBlockSpawnRange = 20;
const PlayerRange = 3;

const BlockIndexs = ['FlipC', 'FlipB', 'FlipA'];
const BlockPostures = [[[0, 0]], [[0, -1], [0, 0], [0, 1]], [[-1, 0], [0, 0], [1, 0]]];

const X2SpawnIndexs = ['FlipX2ASpawn', 'FlipX2BSpawn'];
const X2LoopIndexs = ['FlipX2ALoop', 'FlipX2BLoop'];
const X2Postures = [[[0, 1], [0, 0], [0, -1]], [[1, 0], [0, 0], [-1, 0]]];

function Clamp(a, b, c) {
    return a < b ? b : (a > c ? c : a);
}
class MainGame extends Phaser.Scene {
    key = 'MainGame';

    preload() {

        /*let direction = 'Ver'
        function getDirection() {
            switch (window.orientation) {
                case 0:
                case 180:
                    direction = 'Ver'
                    break;
                case -90:
                case 90:
                    direction = 'Hor'
                    break;
            }
        }
        Phaser.World.prototype.displayObjectUpdateTransform = function () {
            if (direction == 'Ver') {
                game.scale.setGameSize(height, width)
                this.x = game.camera.y + game.width;
                this.y = -game.camera.x;
                this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(90));
            } else {
                game.scale.setGameSize(width, height)
                this.x = -game.camera.x;
                this.y = -game.camera.y;
                this.rotation = 0;
            }
            PIXI.DisplayObject.prototype.updateTransform.call(this);
        }*/

        this.cameras.main.backgroundColor.setTo(50, 50, 50);
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBar.setScrollFactor(0, 0);
        progressBox.setScrollFactor(0, 0);
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(w / 2 - 160, h / 2 - 25, 320, 50);

        this.load.on('progress', function (value) {
            //console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(w / 2 - 150, h / 2 - 15, 300 * value, 30);
        });
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
        });


        this.cam = this.cameras.main;

        this.load.spritesheet('Born', 'img/Born.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('HighIdel', 'img/HighIdel.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('HighLeft', 'img/HighLeft.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('HighRight', 'img/HighRight.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('HighUp', 'img/HighUp.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('HighDown', 'img/HighDown.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('Low01Idel', 'img/Low01Idel.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low01Left', 'img/Low01Left.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low01Right', 'img/Low01Right.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low01Up', 'img/Low01Up.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low01Down', 'img/Low01Down.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('Low02Idel', 'img/Low02Idel.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low02Left', 'img/Low02Left.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low02Right', 'img/Low02Right.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low02Up', 'img/Low02Up.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low02Down', 'img/Low02Down.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('FlipA', 'img/FlipA.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('FlipB', 'img/FlipB.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('FlipC', 'img/FlipC.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('FlipX2A', 'img/FlipX2A.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('FlipX2B', 'img/FlipX2B.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('Low01Score', 'img/Low01Score.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low02Score', 'img/Low01Score.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('HighScore', 'img/HighScore.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('Power', 'img/Power.png', { frameWidth: 64, frameHeight: 4 });
        this.load.spritesheet('PowerMax', 'img/PowerMax.png', { frameWidth: 128, frameHeight: 64 });
        this.load.spritesheet('KeyMap', 'img/KeyMap.png', { frameWidth: 128, frameHeight: 80 });

        this.load.spritesheet('Number', 'img/Number.png', { frameWidth: 128, frameHeight: 100 });

        this.load.spritesheet('Boom', 'img/Boom.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('BoomSpawnEffect', 'img/BoomSpawn.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('BoomEffect', 'img/BoomEffect.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('HighDieA', 'img/HighDieA.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low01DieA', 'img/Low01DieA.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low02DieA', 'img/Low02DieA.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('HighDieB', 'img/HighDieB.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low01DieB', 'img/Low01DieB.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low02DieB', 'img/Low02DieB.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('HighIdelLook', 'img/HighIdelLook.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low01IdelLook', 'img/Low01IdelLook.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low02IdelLook', 'img/Low02IdelLook.png', { frameWidth: 256, frameHeight: 256 });


        this.load.spritesheet('HighAfterLife', 'img/HighAfterLife.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low01AfterLife', 'img/Low01AfterLife.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('Low02AfterLife', 'img/Low02AfterLife.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('InfoText', 'img/InfoText.png', { frameWidth: 128, frameHeight: 128 });


        this.load.image('Grid', 'img/Grid.png');
        this.load.image('GridMask', 'img/GridMask.png');
        this.load.image('BG', 'img/BG.png');
        this.load.image('StarSky', 'img/StarSky.png');
        this.load.image('BGBlack', 'img/BGBlack.png');


        this.load.image('MainUI', 'img/MainUI.png');

    }

    CalPos(Pos) {
        let x = Pos.x * xVector.x + Pos.y * yVector.x + w / 2;
        let y = Pos.x * xVector.y + Pos.y * yVector.y + h / 2;
        return new Phaser.Math.Vector2(x, y);
    }
    makeAni() {

        this.anims.create({
            key: 'Born',
            frames: this.anims.generateFrameNumbers('Born', { start: 0, end: 9 }),
            frameRate: FPS,
            //repeat: -1
        })


        this.anims.create({
            key: 'HighIdel',
            frames: this.anims.generateFrameNumbers('HighIdel', { start: 0, end: 9 }),
            frameRate: 12,
            //repeat: -1
        })
        this.anims.create({
            key: 'HighLeft',
            frames: this.anims.generateFrameNumbers('HighLeft', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })
        this.anims.create({
            key: 'HighRight',
            frames: this.anims.generateFrameNumbers('HighRight', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })
        this.anims.create({
            key: 'HighUp',
            frames: this.anims.generateFrameNumbers('HighUp', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })
        this.anims.create({
            key: 'HighDown',
            frames: this.anims.generateFrameNumbers('HighDown', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })

        this.anims.create({
            key: 'Low01Idel',
            frames: this.anims.generateFrameNumbers('Low01Idel', { start: 0, end: 9 }),
            frameRate: 12,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low01Left',
            frames: this.anims.generateFrameNumbers('Low01Left', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low01Right',
            frames: this.anims.generateFrameNumbers('Low01Right', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low01Up',
            frames: this.anims.generateFrameNumbers('Low01Up', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low01Down',
            frames: this.anims.generateFrameNumbers('Low01Down', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })

        this.anims.create({
            key: 'Low02Idel',
            frames: this.anims.generateFrameNumbers('Low02Idel', { start: 0, end: 9 }),
            frameRate: 12,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low02Left',
            frames: this.anims.generateFrameNumbers('Low02Left', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low02Right',
            frames: this.anims.generateFrameNumbers('Low02Right', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low02Up',
            frames: this.anims.generateFrameNumbers('Low02Up', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low02Down',
            frames: this.anims.generateFrameNumbers('Low02Down', { start: 0, end: aniFrame - 1 }),
            frameRate: FPS,
            //repeat: -1
        })


        this.anims.create({
            key: 'FlipA',
            frames: this.anims.generateFrameNumbers('FlipA', { start: 0, end: 9 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'FlipB',
            frames: this.anims.generateFrameNumbers('FlipB', { start: 0, end: 9 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'FlipC',
            frames: this.anims.generateFrameNumbers('FlipC', { start: 0, end: 9 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'FlipX2ASpawn',
            frames: this.anims.generateFrameNumbers('FlipX2A', { start: 0, end: 9 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'FlipX2ALoop',
            frames: this.anims.generateFrameNumbers('FlipX2A', { start: 10, end: 19 }),
            frameRate: 25,
            repeat: -1
        })
        this.anims.create({
            key: 'FlipX2BSpawn',
            frames: this.anims.generateFrameNumbers('FlipX2B', { start: 0, end: 9 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'FlipX2BLoop',
            frames: this.anims.generateFrameNumbers('FlipX2B', { start: 10, end: 19 }),
            frameRate: 25,
            repeat: -1
        })


        this.anims.create({
            key: 'HighScore',
            frames: this.anims.generateFrameNumbers('HighScore', { start: 0, end: 9 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low01Score',
            frames: this.anims.generateFrameNumbers('Low01Score', { start: 0, end: 9 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low02Score',
            frames: this.anims.generateFrameNumbers('Low02Score', { start: 0, end: 9 }),
            frameRate: 25,
            //repeat: -1
        })

        this.anims.create({
            key: 'PowerMax',
            frames: this.anims.generateFrameNumbers('PowerMax', { start: 0, end: 31 }),
            frameRate: 60,
            //repeat: -1
        })

        this.anims.create({
            key: 'BoomSpawn',
            frames: this.anims.generateFrameNumbers('Boom', { start: 0, end: 9 }),
            frameRate: 25,
            //repeat: -1
        })

        this.anims.create({
            key: 'BoomLoop',
            frames: this.anims.generateFrameNumbers('Boom', { start: 10, end: 19 }),
            frameRate: 25,
            repeat: -1
        })

        this.anims.create({
            key: 'BoomSpawnEffect',
            frames: this.anims.generateFrameNumbers('BoomSpawnEffect', { start: 0, end: 9 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'BoomEffect',
            frames: this.anims.generateFrameNumbers('BoomEffect', { start: 0, end: 19 }),
            frameRate: 45,
            //repeat: -1
        })



        this.anims.create({
            key: 'HighDieA',
            frames: this.anims.generateFrameNumbers('HighDieA', { start: 2, end: 31 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low01DieA',
            frames: this.anims.generateFrameNumbers('Low01DieA', { start: 1, end: 31 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low02DieA',
            frames: this.anims.generateFrameNumbers('Low02DieA', { start: 1, end: 31 }),
            frameRate: 25,
            //repeat: -1
        })

        this.anims.create({
            key: 'HighDieB',
            frames: this.anims.generateFrameNumbers('HighDieB', { start: 2, end: 31 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low01DieB',
            frames: this.anims.generateFrameNumbers('Low01DieB', { start: 1, end: 31 }),
            frameRate: 25,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low02DieB',
            frames: this.anims.generateFrameNumbers('Low02DieB', { start: 1, end: 31 }),
            frameRate: 25,
            //repeat: -1
        })

        this.anims.create({
            key: 'HighIdelLook',
            frames: this.anims.generateFrameNumbers('HighIdelLook', { start: 0, end: 9 }),
            frameRate: 12,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low01IdelLook',
            frames: this.anims.generateFrameNumbers('Low01IdelLook', { start: 0, end: 9 }),
            frameRate: 12,
            //repeat: -1
        })
        this.anims.create({
            key: 'Low02IdelLook',
            frames: this.anims.generateFrameNumbers('Low02IdelLook', { start: 0, end: 9 }),
            frameRate: 12,
            //repeat: -1
        })

        this.anims.create({
            key: 'HighAfterLife',
            frames: this.anims.generateFrameNumbers('HighAfterLife', { start: 0, end: 31 }),
            frameRate: 25,
            repeat: -1
        })
        this.anims.create({
            key: 'Low01AfterLife',
            frames: this.anims.generateFrameNumbers('Low01AfterLife', { start: 0, end: 31 }),
            frameRate: 25,
            repeat: -1
        })
        this.anims.create({
            key: 'Low02AfterLife',
            frames: this.anims.generateFrameNumbers('Low02AfterLife', { start: 0, end: 31 }),
            frameRate: 25,
            repeat: -1
        })

        this.infoTextAni = [];
        let ani = ['10', '5', '25'];
        let realindex = [1, 0, 2];
        for (let i = 0; i < 3; i++) {
            this.infoTextAni[realindex[i]] = [];
            for (let j = 0; j < 5; j++) {
                this.infoTextAni[realindex[i]][j] = ani[realindex[i]] + '_' + j.toString();
                this.anims.create({
                    key: this.infoTextAni[realindex[i]][j],
                    frames: this.anims.generateFrameNumbers('InfoText', { start: 15 * j + 5 * i, end: 15 * j + 5 * i + 4 }),
                    frameRate: 7,
                    //repeat: -1
                })

            }
        }

        this.anims.create({
            key: 'x2_info',
            frames: this.anims.generateFrameNumbers('InfoText', { start: 75, end: 80 }),
            frameRate: 7,
            //repeat: -1
        })


    }
    resetGame() {
        /*this.scene.start('MainGame')
        this.scene.stop();*/
        playerPos = new Phaser.Math.Vector2(10, (mapSize - 1) / 2);
        playerPos = new Phaser.Math.Vector2(10, (mapSize - 1) / 2);
        CameraPos = new Phaser.Math.Vector2(10, (mapSize - 1) / 2);
        preCamPos = new Phaser.Math.Vector2(10, (mapSize - 1) / 2);
        PlayerUIPos = new Phaser.Math.Vector2(10, (mapSize - 1) / 2);
        cameraZoom = defaultCameraZoom;
        playerPosture = 0;
        timeCount = aniTime;
        nextInput = -1;
        afterLife = 0;
        endTime = -1;
        realAfterLife = 0;
        afterLifeHigh = 0;
        afterLifeZero = 0;
        lookcount = 0;

        this.MainUI.y = 64 - h / 2;
        this.KeyMap.y = h * (1 - (1 - controlPanle) / 2) - h / 2;
        let scale = [1.2, 1, 0.8, 0.75, 0.72, 0.70, 0.685, 0.67];
        for (let i = 0; i != 8; i++) {
            this.ScoreMap[i].y = 60 - 50 * (1 - scale[i]) - h / 2;
        }

        this.playerAfterLife.alpha = 0;
        this.BGBlack.alpha = 1;
        this.StarSky.alpha = 0;

        let i = 0;
        while (i < blocks.length) {
            blocks[i].destroy();
            blocks.splice(i, 1);
            i++;
        }
        i = 0;
        while (i < booms.length) {
            booms[i].destroy();
            booms.splice(i, 1);
            i++;
        }


        //blocks = [];
        //booms = [];
        combo = 1;
        comboTimeCount = 0;

        x2s = 0;
        Score = 0;
        displayScore = 0;
        power = 30;
        currentDiff = 30;
        gameTime = 0;
        blockSpawnTimeCount = 0;
        X2SpawnTimeCount = 0;
        playerDying = false;
        playerDied = false;
        howToDie = 0;

        this.PowerBar.visible = true;
        this.player.anims.play('Born', true);
        this.updatePlayer();
        this.updateScore(1);
    }
    animateControl() {
        if (playerDying)
            return;
        this.updatePlayer();
        switch (nextInput) {
            case 0:
                switch (playerPosture) {
                    case 0:
                        this.player.anims.play('HighUp', true);
                        playerPos.x += 2;
                        playerPosture = 2;
                        break;
                    case 1:
                        this.player.anims.play('Low01Up', true);
                        playerPos.x += 1;
                        playerPosture = 1;
                        break;
                    case 2:
                        this.player.anims.play('Low02Up', true);
                        playerPos.x += 2;
                        playerPosture = 0;
                        break;
                }
                nextInput = -1;
                timeCount = aniTime;
                break;
            case 1:
                switch (playerPosture) {
                    case 0:
                        this.player.anims.play('HighLeft', true);
                        playerPos.y += 2;
                        playerPosture = 1;
                        break;
                    case 1:
                        this.player.anims.play('Low01Left', true);
                        playerPos.y += 2;
                        playerPosture = 0;
                        break;
                    case 2:
                        this.player.anims.play('Low02Left', true);
                        playerPos.y += 1;
                        playerPosture = 2;
                        break;
                }
                nextInput = -1;
                timeCount = aniTime;
                break;
            case 2:
                switch (playerPosture) {
                    case 0:
                        this.player.anims.play('HighDown', true);
                        playerPos.x -= 2;
                        playerPosture = 2;
                        break;
                    case 1:
                        this.player.anims.play('Low01Down', true);
                        playerPos.x -= 1;
                        playerPosture = 1;
                        break;
                    case 2:
                        this.player.anims.play('Low02Down', true);
                        playerPos.x -= 2;
                        playerPosture = 0;
                        break;
                }
                nextInput = -1;
                timeCount = aniTime;
                break;
            case 3:
                switch (playerPosture) {
                    case 0:
                        this.player.anims.play('HighRight', true);
                        playerPos.y -= 2;
                        playerPosture = 1;
                        break;
                    case 1:
                        this.player.anims.play('Low01Right', true);
                        playerPos.y -= 2;
                        playerPosture = 0;
                        break;
                    case 2:
                        this.player.anims.play('Low02Right', true);
                        playerPos.y -= 1;
                        playerPosture = 2;
                        break;
                }
                nextInput = -1;
                timeCount = aniTime;
                break;
            default:
                return;
        }
    }
    updateScore(delta) {
        displayScore = (Score - displayScore) * 10 * delta / 1000 + displayScore;
        let ScoreString = Math.ceil(displayScore).toString();
        let Num = [];
        for (let i = 0; i != ScoreString.length; i++) {
            Num[i] = Number(ScoreString[i]);
        }
        for (let i = 0; i != 8; i++) {
            if (i < Num.length) {
                this.ScoreMap[i].visible = true;
                this.ScoreMap[i].setFrame(Num[i]);
            } else {
                this.ScoreMap[i].visible = false;
            }
        }
    }
    create() {
        this.cam.setZoom(1.3);
        //this.cam.backgroundColor.setTo(50, 50, 50);
        this.BG = this.add.image(w / 2, h / 2, 'BG');
        this.BG.setScale(w / 16, h / 256);
        this.BG.setScrollFactor(0, 0);

        this.StarSky = this.add.image(w / 2, h / 2, 'StarSky');
        this.StarSky.setScale(w / 16, h / 256);
        this.StarSky.setScrollFactor(0, 0);
        this.StarSky.alpha = 0;

        this.BGBlack = this.add.image(w / 2, h / 2, 'BGBlack');
        this.BGBlack.setScale(w / 16, h / 256);
        this.BGBlack.setScrollFactor(0, 0);

        this.PowerBar = this.add.image(0, h * 0.05, 'Power', 0);
        this.PowerBar.setScale(1.5, 1.5);

        this.MainUI = this.add.image(256 - w / 2, 64 - h / 2, 'MainUI');

        this.KeyMap = this.add.image(0, h * (1 - (1 - controlPanle) / 2) - h / 2, 'KeyMap', 0);
        let KeyMapSize = Math.min(w * 0.8 / 128, h * 0.5 / 128);
        this.KeyMap.setScale(KeyMapSize, KeyMapSize);




        this.ScoreMap = [];
        let scale = [1.2, 1, 0.8, 0.75, 0.72, 0.70, 0.685, 0.67];
        let nowpos = -35;
        for (let i = 0; i != 8; i++) {
            nowpos += 75 * scale[i];
            this.ScoreMap[i] = this.add.image(nowpos - w / 2, 60 - 50 * (1 - scale[i]) - h / 2, 'Number', 0);
            this.ScoreMap[i].setScale(scale[i], scale[i]);
        }


        this.UIContainer = this.add.container(w / 2, h / 2, [this.MainUI, this.KeyMap].concat(this.ScoreMap));
        this.UIContainer.setScrollFactor(0, 0);
        this.UIContainer.setDepth(50 - playerPos.x - playerPos.x);





        this.PlayerUI = this.add.container(0, 0, [this.PowerBar]);
        this.PlayerUI.setDepth(40 - playerPos.x - playerPos.x);
        //this.PlayerUI.blendMode = 'ADD';

        //console.log(this.UIContainer.depth);



        this.makeAni();
        this.player = this.add.sprite(w / 2, h / 2, 'HighIdel')
        this.player.setScale(2.5);
        this.player.anims.play('Born', true);

        this.playerAfterLife = this.add.sprite(w / 2, h / 2, 'HighAfterLife')
        this.playerAfterLife.setScale(2.5);
        this.playerAfterLife.alpha = 0;

        this.Grid = this.add.image(w / 2, h / 2, 'Grid');
        this.Grid.setScale(1.25);

        this.GridMask = this.add.image(w / 2, h / 2, 'GridMask');
        this.GridMask.setScale(2.5);
        this.GridMask.visible = false;

        this.Grid.mask = new Phaser.Display.Masks.BitmapMask(this, this.GridMask);

        //this.playerAfterLife.anims.play('HighAfterLife', true);
        //console.log(this.player.anims);
        this.updatePlayer();
        this.updateScore(1);
        this.player.on('animationcomplete', () => {
            if (playerDying) {
                if (playerDying && playerDied) {
                    //this.resetGame();
                    return;
                } else {
                    return;
                }
            }
            this.updateBlocks();
            this.updateBooms();
            if (nextInput != -1) {
                this.animateControl();
                return;
            }
            if (Phaser.Math.Between(0, 10000) < 10000 * lookFreq * lookcount) {
                let IdelLookAnims = ['HighIdelLook', 'Low01IdelLook', 'Low02IdelLook'];
                this.player.anims.play(IdelLookAnims[playerPosture], true);
                lookcount = 0;
            } else {
                let IdelAnims = ['HighIdel', 'Low01Idel', 'Low02Idel'];
                this.player.anims.play(IdelAnims[playerPosture], true);
                lookcount++;
            }
            this.updatePlayer();
        })
        keyboard = this.input.keyboard.createCursorKeys();
        keyboard.up.addListener("down", () => {
            if (timeCount > inputDelay * aniTime) {
                nextInput = 0;
                return;
            }
            lookcount = 0;
            nextInput = 0;
            this.animateControl();
            this.KeyMap.setFrame(1);
        });
        keyboard.left.addListener("down", () => {
            if (timeCount > inputDelay * aniTime) {
                nextInput = 1;
                return;
            }
            lookcount = 0;
            nextInput = 1;
            this.animateControl();
            this.KeyMap.setFrame(2);
        });
        keyboard.down.addListener("down", () => {
            if (timeCount > inputDelay * aniTime) {
                nextInput = 2;
                return;
            }
            lookcount = 0;
            nextInput = 2;
            this.animateControl();
            this.KeyMap.setFrame(3);
        });
        keyboard.right.addListener("down", () => {
            if (timeCount > inputDelay * aniTime) {
                nextInput = 3;
                return;
            }
            lookcount = 0;
            nextInput = 3;
            this.animateControl();
            this.KeyMap.setFrame(4);
        });
        keyboard.up.addListener("up", () => { this.KeyMap.setFrame(0); });
        keyboard.left.addListener("up", () => { this.KeyMap.setFrame(0); });
        keyboard.down.addListener("up", () => { this.KeyMap.setFrame(0); });
        keyboard.right.addListener("up", () => { this.KeyMap.setFrame(0); });


        this.input.mouse.disableContextMenu();
        this.input.on('pointerdown', (pointer) => {
            if ((pointer.leftButtonDown() || pointer.rightButtonDown())) {
                if (playerDying) {
                    this.resetGame();
                    return;
                }
                let xFactor = pointer.x / w;
                let yFactor = (h - pointer.y) / (h * (1 - controlPanle));
                let pos;
                let neg;
                if (controlMode == 0) {
                    pos = xFactor > yFactor;
                    neg = yFactor > 1 - xFactor;
                } else if (controlMode == 1) {
                    pos = yFactor < 0.5;
                    neg = xFactor > 0.5;
                }
                if (pos && neg) {
                    if (timeCount > inputDelay * aniTime) {
                        nextInput = 3;
                    } else {
                        nextInput = 3;
                        this.animateControl();
                    }
                    this.KeyMap.setFrame(4);
                    //console.log()
                } else if (pos && !neg) {
                    if (timeCount > inputDelay * aniTime) {
                        nextInput = 2;
                    } else {
                        nextInput = 2;
                        this.animateControl();
                    }
                    this.KeyMap.setFrame(3);
                } else if (!pos && neg) {
                    if (timeCount > inputDelay * aniTime) {
                        nextInput = 0;
                    } else {
                        nextInput = 0;
                        this.animateControl();
                    }
                    this.KeyMap.setFrame(1);
                } else if (!pos && !neg) {
                    if (timeCount > inputDelay * aniTime) {
                        nextInput = 1;
                    } else {
                        nextInput = 1;
                        this.animateControl();
                    }
                    this.KeyMap.setFrame(2);
                }
            }
        });
        this.input.on('pointerup', (pointer) => { this.KeyMap.setFrame(0); });



        /*this.PowerBar = this.add.graphics();
        this.PowerBar.setScrollFactor(0,0);
        this.PowerBar.setDepth(49-playerPos.x-playerPos.x);
        this.PowerBar.fillStyle(0xff0000, 1);
        this.PowerBar.fillRect(385.3-130, 49-18, 260, 36);*/

    }
    clapsBoom(x1, y1, newBlockIndex, x2, y2, thisBlockIndex) {
        var myPostures = BlockPostures[newBlockIndex];
        var thisPostures = BlockPostures[thisBlockIndex];
        for (let j = 0; j != myPostures.length; j++) {
            for (let k = 0; k != thisPostures.length; k++) {
                if (x2 + thisPostures[k][0] == x1 + myPostures[j][0] && y2 + thisPostures[k][1] == y1 + myPostures[j][1]) {
                    return true;
                }
            }
        } return false;
    }
    claps(x, y, newBlockIndex) {
        var myPostures = BlockPostures[newBlockIndex];
        for (let i = 0; i != blocks.length; i++) {
            var thisPostures = BlockPostures[blocks[i].getData('Postures')];
            var thisX = blocks[i].getData('XPos');
            var thisY = blocks[i].getData('YPos');
            for (let j = 0; j != myPostures.length; j++) {
                for (let k = 0; k != thisPostures.length; k++) {
                    if (thisX + thisPostures[k][0] == x + myPostures[j][0] && thisY + thisPostures[k][1] == y + myPostures[j][1]) {
                        return true;
                    }
                }
            }
        }
        for (let i = 0; i != booms.length; i++) {
            var thisX = booms[i].getData('XPos');
            var thisY = booms[i].getData('YPos');
            for (let j = 0; j != myPostures.length; j++) {
                if (thisX == x + myPostures[j][0] && thisY == y + myPostures[j][1]) {
                    return true;
                }
            }
        }
        return false;
    }
    contain(x, y) {
        if (x.length == 0) {
            return false;
        }
        for (let i = 0; i < x.length; i++) {
            if (y == x[i]) {
                return true;
            }
        }
        return false;
    }



    clapsX2(x, y, chosen, newX2Index) {
        var myPostures = X2Postures[newX2Index];
        let roundBoomPos = [[[0, 2], [1, 2], [1, 1], [1, 0], [1, -1], [1, -2], [0, -2], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2]],
        [[2, 0], [2, 1], [1, 1], [0, 1], [-1, 1], [-2, 1], [-2, 0], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1]]];
        let roundBoom = [];

        for (let i = 0; i != chosen.length; i++) {
            roundBoom.push(roundBoomPos[newX2Index][chosen[i]]);
        }

        let allPosture = myPostures.slice().concat(roundBoom);

        for (let i = 0; i != blocks.length; i++) {
            var thisPostures = BlockPostures[blocks[i].getData('Postures')];
            var thisX = blocks[i].getData('XPos');
            var thisY = blocks[i].getData('YPos');
            for (let j = 0; j != allPosture.length; j++) {
                for (let k = 0; k != thisPostures.length; k++) {
                    if (thisX + thisPostures[k][0] == x + allPosture[j][0] && thisY + thisPostures[k][1] == y + allPosture[j][1]) {
                        return true;
                    }
                }
            }
        }
        for (let i = 0; i != booms.length; i++) {
            var thisX = booms[i].getData('XPos');
            var thisY = booms[i].getData('YPos');
            for (let j = 0; j != allPosture.length; j++) {
                if (thisX == x + allPosture[j][0] && thisY == y + allPosture[j][1]) {
                    return true;
                }
            }
        }

        return false;
    }
    Coincide(thisX, thisY, thisIndex) {
        var myPostures = BlockPostures[playerPosture];
        var x = playerPos.x;
        var y = playerPos.y;
        var thisPostures = BlockPostures[thisIndex];
        if (thisPostures.length != myPostures.length) {
            return false;
        }
        for (let j = 0; j != myPostures.length; j++) {
            if ((thisX + thisPostures[j][0] != x + myPostures[j][0]) || (thisY + thisPostures[j][1] != y + myPostures[j][1])) {
                return false;
            }
        }
        return true;
    }
    spawnNewBlock() {
        if (blocks.length < maxBlockNum) {
            //for (let i = blocks.length; i < maxBlockNum; i++) {
            let x, y;
            let newBlockIndex;
            do {
                x = Phaser.Math.Between(playerPos.x - newBlockSpawnRange, playerPos.x + newBlockSpawnRange);
                y = Phaser.Math.Between(playerPos.y - newBlockSpawnRange, playerPos.y + newBlockSpawnRange);
                newBlockIndex = Phaser.Math.Between(0, 2);
            } while (this.claps(x, y, newBlockIndex) || (Math.abs(x - playerPos.x) < PlayerRange && Math.abs(y - playerPos.y) < PlayerRange))


            let newBlock = this.add.sprite(w / 2, h / 2, BlockIndexs[newBlockIndex]);

            let newPos = this.CalPos(new Phaser.Math.Vector2(x, y));
            newBlock.x = newPos.x;
            newBlock.y = newPos.y;
            newBlock.setDepth(- x - y);

            newBlock.setScale(1.25);
            newBlock.anims.play(BlockIndexs[newBlockIndex], true);

            newBlock.setData('XPos', x);
            newBlock.setData('YPos', y);
            newBlock.setData('Postures', newBlockIndex);
            newBlock.setData('type', 0);

            blocks.push(newBlock);
            //}
        }
        if (booms.length < maxBoomNum) {
            //for (let i = blocks.length; i < maxBlockNum; i++) {
            let x, y;
            let newBoomIndex;
            do {
                x = Phaser.Math.Between(playerPos.x - newBlockSpawnRange, playerPos.x + newBlockSpawnRange);
                y = Phaser.Math.Between(playerPos.y - newBlockSpawnRange, playerPos.y + newBlockSpawnRange);
                newBoomIndex = 0;
            } while (this.claps(x, y, 0) || (Math.abs(x - playerPos.x) < PlayerRange && Math.abs(y - playerPos.y) < PlayerRange))


            let newPos = this.CalPos(new Phaser.Math.Vector2(x, y));

            let newBoomEffect = this.add.sprite(w / 2, h / 2, "BoomSpawnEffect");

            newBoomEffect.x = newPos.x;
            newBoomEffect.y = newPos.y;
            newBoomEffect.setDepth(1 - x - y);

            newBoomEffect.setScale(1.25);
            newBoomEffect.anims.play("BoomSpawnEffect", true);

            newBoomEffect.on('animationcomplete', () => {
                newBoomEffect.destroy();
            })

            let newBoom = this.add.sprite(w / 2, h / 2, "BoomSpawn");


            newBoom.x = newPos.x;
            newBoom.y = newPos.y;
            newBoom.setDepth(- x - y);

            newBoom.setScale(1.25);
            newBoom.anims.play("BoomSpawn", true);

            newBoom.setData('XPos', x);
            newBoom.setData('YPos', y);
            newBoom.setData('Index', newBoomIndex);
            newBoom.on('animationcomplete', () => {
                newBoom.anims.play("BoomLoop", true);
            })


            //console.log(newBoom);
            booms.push(newBoom);
            //}
        }

    }
    spawnNewX2() {
        if (x2s < maxX2Num) {
            //for (let i = blocks.length; i < maxBlockNum; i++) {
            let x, y;
            let newX2Index;
            let roundBoomNum = 4;
            let chosen = [];
            do {
                x = Phaser.Math.Between(playerPos.x - newBlockSpawnRange - 2, playerPos.x + newBlockSpawnRange - 2);
                y = Phaser.Math.Between(playerPos.y - newBlockSpawnRange - 2, playerPos.y + newBlockSpawnRange - 2);
                newX2Index = Phaser.Math.Between(0, 1);
                chosen = [];
                for (let i = 0; i != roundBoomNum; i++) {
                    let boomIndex = Phaser.Math.Between(0, 11);
                    while (this.contain(chosen, boomIndex)) {
                        boomIndex = Phaser.Math.Between(0, 11);
                    }
                    chosen.push(boomIndex);
                }
            } while (this.clapsX2(x, y, chosen, newX2Index) || (Math.abs(x - playerPos.x) < PlayerRange + 2 && Math.abs(y - playerPos.y) < PlayerRange + 2))



            let newX2 = this.add.sprite(w / 2, h / 2, X2SpawnIndexs[newX2Index]);
            let newPos = this.CalPos(new Phaser.Math.Vector2(x, y));
            newX2.x = newPos.x;
            newX2.y = newPos.y;
            newX2.setDepth(- x - y);
            newX2.setScale(1.25);
            newX2.anims.play(X2SpawnIndexs[newX2Index], true);
            newX2.setData('XPos', x);
            newX2.setData('YPos', y);
            newX2.setData('Postures', newX2Index + 1);
            newX2.setData('type', 1);
            newX2.on('animationcomplete', () => {
                newX2.anims.play(X2LoopIndexs[newX2Index], true);
            })
            x2s++;
            blocks.push(newX2);

            let roundBoomPos = [[[0, 2], [1, 2], [1, 1], [1, 0], [1, -1], [1, -2], [0, -2], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2]],
            [[2, 0], [2, 1], [1, 1], [0, 1], [-1, 1], [-2, 1], [-2, 0], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1]]];

            let newboom = [];
            for (let i = 0; i != chosen.length; i++) {
                let boomPos = roundBoomPos[newX2Index][chosen[i]];

                let boomX = boomPos[0] + x;
                let boomY = boomPos[1] + y;

                let newPos = this.CalPos(new Phaser.Math.Vector2(boomX, boomY));
                let newBoomEffect = this.add.sprite(w / 2, h / 2, "BoomSpawnEffect");

                newBoomEffect.x = newPos.x;
                newBoomEffect.y = newPos.y;
                newBoomEffect.setDepth(1 - boomX - boomY);

                newBoomEffect.setScale(1.25);
                newBoomEffect.anims.play("BoomSpawnEffect", true);

                newBoomEffect.on('animationcomplete', () => {
                    newBoomEffect.destroy();
                })

                newboom[i] = this.add.sprite(w / 2, h / 2, "BoomSpawn");


                newboom[i].x = newPos.x;
                newboom[i].y = newPos.y;
                newboom[i].setDepth(- boomX - boomY);

                newboom[i].setScale(1.25);
                newboom[i].anims.play("BoomSpawn", true);

                newboom[i].setData('XPos', boomX);
                newboom[i].setData('YPos', boomY);
                newboom[i].setData('Index', 0);
                newboom[i].on('animationcomplete', () => {
                    newboom[i].anims.play("BoomLoop", true);
                })

                //console.log(boomPos);
                //console.log(newboom[i]);
                //console.log(newBoom);
                booms.push(newboom[i]);
            }

        }
    }
    updateCamera(delta) {
        CameraPos.lerp(playerPos, 1 * delta / 1000);
        let c = this.CalPos(CameraPos);
        this.cam.centerOn(c.x, c.y - realAfterLife);


        this.GridMask.x = c.x;
        this.GridMask.y = c.y;
        this.GridMask.setDepth(-19 - playerPos.x - playerPos.y);

        //console.log(CameraPos.x);
        var speed = CameraPos.distance(preCamPos) * 1000 / delta;
        cameraZoom = ((defaultCameraZoom / Math.exp(speed / 25)) + Clamp(realAfterLife / 200, 0, 1) * 0.15 - cameraZoom) * 1 * delta / 1000 + cameraZoom;
        this.cam.setZoom(cameraZoom);

        this.UIContainer.setScale(1 / cameraZoom, 1 / cameraZoom);

        this.BG.setScale(w / 16 / cameraZoom, h / 256 / cameraZoom);
        this.BG.setDepth(-100 - playerPos.x - playerPos.y);


        this.BGBlack.setScale(w / 16 / cameraZoom, h / 256 / cameraZoom);
        this.BGBlack.setDepth(30 - playerPos.x - playerPos.y);

        this.StarSky.setScale(w / 16 / cameraZoom, h / 256 / cameraZoom);
        this.StarSky.setDepth(19 - playerPos.x - playerPos.y);

        preCamPos.copy(CameraPos);
    }
    updatePlayerUI(delta) {
        let posTempX = playerPosture == 0 ? 0 : (playerPosture == 1 ? -0.35 : 0.35);
        let posTempY = playerPosture == 0 ? 0 : (playerPosture == 1 ? 0.35 : -0.35);
        //posTempY = 0;
        //posTempX = 0;
        let newPos = new Phaser.Math.Vector2(playerPos.x + posTempX, playerPos.y + posTempY);
        PlayerUIPos.lerp(newPos, 30 * delta / 1000);
        let p = this.CalPos(PlayerUIPos);
        this.PlayerUI.x = p.x;
        this.PlayerUI.y = p.y;

        this.PlayerUI.setScale(1 / cameraZoom, 1 / cameraZoom);
    }
    updatePlayer() {
        let newPos = this.CalPos(playerPos);
        this.player.x = newPos.x;
        this.player.y = newPos.y;
        this.player.setDepth(35 - playerPos.x - playerPos.y);
        this.UIContainer.setDepth(50 - playerPos.x - playerPos.y);
        this.BG.setDepth(-100 - playerPos.x - playerPos.y);
        this.PlayerUI.setDepth(40 - playerPos.x - playerPos.y);

        this.Grid.x = newPos.x;
        this.Grid.y = newPos.y;
        this.Grid.setDepth(-20 - playerPos.x - playerPos.y);

        //console.log(this.UIContainer);
    }
    deleteFarBlocks() {
        let i = 0;
        while (i < blocks.length) {
            let x = blocks[i].getData('XPos');
            let y = blocks[i].getData('YPos');
            let type = blocks[i].getData('type');
            if (Math.abs(x - playerPos.x) > newBlockSpawnRange || Math.abs(y - playerPos.y) > newBlockSpawnRange) {
                blocks[i].destroy();
                blocks.splice(i, 1);
                if (type == 1) {
                    x2s--;
                }
                //console.log('delete blocks');
            }
            i++;
        }
        i = 0;
        //console.log(booms);
        while (i < booms.length) {
            let x = booms[i].getData('XPos');
            let y = booms[i].getData('YPos');
            if (Math.abs(x - playerPos.x) > newBlockSpawnRange || Math.abs(y - playerPos.y) > newBlockSpawnRange) {
                booms[i].destroy();
                booms.splice(i, 1);
                //console.log('delete Boom');
            }
            i++;
        }
    }
    makeTempAni(x, y, aniIndex, scale, depth) {
        let temp = this.add.sprite(w / 2, h / 2, aniIndex);
        var newTempPos = this.CalPos(new Phaser.Math.Vector2(x, y));
        temp.x = newTempPos.x;
        temp.y = newTempPos.y;
        temp.setScale(scale);
        temp.setDepth(depth);
        temp.anims.play(aniIndex, true);
        temp.on('animationcomplete', () => {
            temp.destroy();
        })
    }
    updateBlocks() {
        let i = 0;
        while (i < blocks.length) {
            let x = blocks[i].getData('XPos');
            let y = blocks[i].getData('YPos');
            let Index = blocks[i].getData('Postures');
            let type = blocks[i].getData('type');
            if (this.Coincide(x, y, Index)) {
                let ScoreSize = 2.5;
                blocks[i].destroy();
                blocks.splice(i, 1);
                if (type == 1) {
                    Score *= 2;
                    ScoreSize = 3;
                    x2s--;
                    this.cam.shake(150, 0.03);
                    this.makeTempAni(x+3, y+3, 'x2_info', 2, 36 - playerPos.x - playerPos.y);
                } else {
                    Score += [10, 5, 25][Index] * combo;
                    this.cam.shake(150, [0.005, 0.0025, 0.0125][Index] * combo);
                    this.makeTempAni(x+3, y+3, this.infoTextAni[Index][combo - 1], 1.5, 36 - playerPos.x - playerPos.y);
                }
                power = (1 - (Math.atan(Math.pow(gameTime / diffTimeScale, 1.5)) / (0.5 * Math.PI))) * (startDiff - endDiff) + endDiff;
                currentDiff = power;

                let powerMax = this.add.sprite(32 * 1.5, h * 0.05, 'PowerMax');
                powerMax.setScale(1.5, 1.5);
                this.PlayerUI.add(powerMax);
                powerMax.anims.play('PowerMax', true);
                powerMax.on('animationcomplete', () => {
                    powerMax.destroy();
                })
                combo++;
                combo = Clamp(combo, 1, 5);
                comboTimeCount = comboTime;


                keyboard = this.input.keyboard.createCursorKeys();
                keyboard.up.addListener("down", () => {
                    if (timeCount > inputDelay * aniTime) {
                        nextInput = 0;
                        return;
                    }
                    nextInput = 0;
                    this.animateControl();
                    this.KeyMap.setFrame(1);
                });
                //console.log(Score)

                this.makeTempAni(playerPos.x, playerPos.y, ['HighScore', 'Low01Score', 'Low02Score'][playerPosture], ScoreSize, 1 - playerPos.x - playerPos.y);

                return;
            }
            i++;
        }
    }
    updateBooms() {
        let i = 0;
        let boomCount = 0;
        while (i < booms.length) {
            let x = booms[i].getData('XPos');
            let y = booms[i].getData('YPos');

            if (this.clapsBoom(x, y, 0, playerPos.x, playerPos.y, playerPosture)) {
                booms[i].destroy();
                booms.splice(i, 1);
                playerDying = true;
                howToDie = 0;
                this.cam.shake(150, 0.05);
                this.makeTempAni(x, y, 'BoomEffect', 3, 19 - playerPos.x - playerPos.y);
                this.makeTempAni(x, y, 'BoomSpawnEffect', 3, 18 - playerPos.x - playerPos.y);

                if (boomCount < 3) {
                    boomCount++;
                } else {
                    return;
                }
            }
            i++;
        }
    }
    makePlayerDie() {
        this.updatePlayer();
        let DieAnimsA = ['HighDieA', 'Low01DieA', 'Low02DieA'];
        let DieAnimsB = ['HighDieB', 'Low01DieB', 'Low02DieB'];
        let AfterLifeAnims = ['HighAfterLife', 'Low01AfterLife', 'Low02AfterLife'];
        if (howToDie == 0) {
            this.player.anims.play(DieAnimsA[playerPosture], true);
        } else {
            this.player.anims.play(DieAnimsB[playerPosture], true);
        }
        this.PowerBar.visible = false;

        this.playerAfterLife.x = this.player.x;
        this.playerAfterLife.y = this.player.y;
        this.playerAfterLife.depth = this.player.depth + 1;
        afterLifeZero = this.player.y;
        this.playerAfterLife.anims.play(AfterLifeAnims[playerPosture], true);

        /*var newDyingEffect = this.add.sprite(w / 2, h / 2, 'BoomSpawnEffect');
        var newEffectPos = this.CalPos(playerPos);
        newDyingEffect.x = newEffectPos.x;
        newDyingEffect.y = newEffectPos.y;
        newDyingEffect.setScale(2.5);
        newDyingEffect.setDepth(-playerPos.x - playerPos.y);
        newDyingEffect.anims.play('BoomSpawnEffect', true);
        newDyingEffect.on('animationcomplete', () => {
            newDyingEffect.destroy();
        })*/

        playerDied = true;
    }
    update(time, delta) {
        realAfterLife = (afterLife - realAfterLife) * 50 / delta / 1000 + realAfterLife;
        //realAfterLife = afterLife

        gameTime += delta / 1000;
        //console.log(gameTime);
        this.deleteFarBlocks();
        if (timeCount > 0) {
            timeCount -= delta / 1000;
        } else {
            if (playerDying && !playerDied) {
                this.makePlayerDie();
            }
        }
        if (playerDying) {
            endTime = endTime < 0 ? time / 1000 : endTime;
            afterLife = (time / 1000 - endTime) * 200;

            this.MainUI.y = 64 - h / 2 - realAfterLife;
            this.KeyMap.y = h * (1 - (1 - controlPanle) / 2) - h / 2 + realAfterLife * 4;
            let scale = [1.2, 1, 0.8, 0.75, 0.72, 0.70, 0.685, 0.67];
            for (let i = 0; i != 8; i++) {
                this.ScoreMap[i].y = 60 - 50 * (1 - scale[i]) - h / 2 - realAfterLife * Math.pow(0.9, 7 - i) * 0.9;
            }

            this.playerAfterLife.alpha = Clamp(realAfterLife / 200, 0, 1);
            this.BGBlack.alpha = 1 - Clamp(realAfterLife / 600, 0, 1);
            let playerAfterLifeFactor = (1 - Math.cos(Clamp(realAfterLife / 800, 0, 1) * Math.PI)) * 0.5;
            this.playerAfterLife.y = afterLifeZero - realAfterLife - playerAfterLifeFactor * (0.5 * h - 256) / this.cam.zoom;
            this.StarSky.alpha = Clamp((realAfterLife - 1000) / 500, 0, 1);
        }
        if (power > 0) {
            power -= delta / 1000;
        } else {
            power = 0;
            playerDying = true;
            howToDie = 1;
            //console.log('Die!');
        }
        this.PowerBar.setTexture('Power', Math.min(Math.floor((1 - power / currentDiff) * 64), 63));
        this.updateCamera(delta);
        this.updatePlayerUI(delta)
        if (blockSpawnTimeCount > 0) {
            blockSpawnTimeCount -= delta / 1000;
        } else {
            blockSpawnTimeCount = blockSpawnTime;
            this.spawnNewBlock();
        }

        if (X2SpawnTimeCount > 0) {
            X2SpawnTimeCount -= delta / 1000;
        } else {
            X2SpawnTimeCount = X2SpawnTime;
            this.spawnNewX2();
        }

        if (comboTimeCount > 0) {
            comboTimeCount -= delta / 1000;
        } else {
            comboTimeCount = 0;
            combo = 1;
        }

        this.updateScore(delta);

    }
}