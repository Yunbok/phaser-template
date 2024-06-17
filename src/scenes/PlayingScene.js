import Phaser from "phaser";
import Config from "../Config";
import Player from "../characters/Player";
import Mob from "../characters/Mob";
import { setBackground } from "../utils/backgroundManager";
import { addMobEvent } from "../utils/mobManager";
import { addAttackEvent } from "../utils/attackManager";

export default class PlayingScene extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        // 사용할 sound들을 추가해놓는 부분입니다.
        // load는 전역적으로 어떤 scene에서든 asset을 사용할 수 있도록 load 해주는 것이고,
        // add는 해당 scene에서 사용할 수 있도록 scene의 멤버 변수로 추가할 때 사용하는 것입니다.
        this.sound.pauseOnBlur = false;
        this.m_beamSound = this.sound.add("audio_beam");
        this.m_scratchSound = this.sound.add("audio_scratch");
        this.m_hitMobSound = this.sound.add("audio_hitMob");
        this.m_growlSound = this.sound.add("audio_growl");
        this.m_explosionSound = this.sound.add("audio_explosion");
        this.m_expUpSound = this.sound.add("audio_expUp");
        this.m_hurtSound = this.sound.add("audio_hurt");
        this.m_nextLevelSound = this.sound.add("audio_nextLevel");
        this.m_gameOverSound = this.sound.add("audio_gameOver");
        this.m_gameClearSound = this.sound.add("audio_gameClear");
        this.m_pauseInSound = this.sound.add("audio_pauseIn");
        this.m_pauseOutSound = this.sound.add("audio_pauseOut");


        // player를 m_player라는 멤버 변수로 추가합니다.
        this.m_player = new Player(this);

        this.cameras.main.startFollow(this.m_player)

        // PlayingScene의 background를 설정합니다.
        setBackground(this, "background1");

        this.m_cursorKeys = this.input.keyboard.createCursorKeys();

        this.m_mobs = this.physics.add.group();
        this.m_mobs.add(new Mob(this, 0,0, "mob1", "mob1_aninm", 10))
        this.m_mobEvents = [];

        addMobEvent(this, 1000, "mob1", "mob1_aninm", 10, 0.9)
        // addMobEvent(this, 1000, "mob2", "mob2_aninm", 10, 0.9)

        this.m_weaponDynamic = this.add.group();
        this.m_weaponStatic = this.add.group();
        this.m_attackEvents = {};
        addAttackEvent(this, "beam", 10, 1,1000)

    }

    update() {
        this.movePlayerManager();

        this.m_background.setX(this.m_player.x - Config.width / 2)
        this.m_background.setY(this.m_player.y - Config.height / 2)

        this.m_background.tilePositionX = this.m_player.x - Config.width / 2
        this.m_background.tilePositionY = this.m_player.y - Config.height / 2
        const closest = this.physics.closest(
            this.m_player,
            this.m_mobs.getChildren()
        );
        this.m_closest = closest;
    }

    movePlayerManager() {
        if (this.m_cursorKeys.left.isDown
            || this.m_cursorKeys.right.isDown
            || this.m_cursorKeys.up.isDown
            || this.m_cursorKeys.down.isDown
        ) {
            if (!this.m_player.m_moving) {
                this.m_player.play('player_anim');
            }

            this.m_player.m_moving = true;
        } else {
            if (this.m_player.m_moving) {
                this.m_player.play('player_idle');
            }
            this.m_player.m_moving = false;
        }

        let vector = [0, 0];

        if (this.m_cursorKeys.left.isDown) {
            // this.m_player.x -= PLAYER_SPEED;
            // this.m_player.flipX = false;
            vector[0] += -1;
        } else if (this.m_cursorKeys.right.isDown) {
            // this.m_player.x += PLAYER_SPEED;
            // this.m_player.flipX = true;
            vector[0] += 1;
        }

        if (this.m_cursorKeys.up.isDown) {
            vector[1] += -1;
        } else if (this.m_cursorKeys.down.isDown) {
            vector[1] += 1;
        }
        this.m_player.move(vector);

    }
}