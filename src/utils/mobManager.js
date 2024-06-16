import Mob from "../characters/Mob"
import { getRandomPosition } from "./math"

export function addMobEvent(scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate) {

    let timer = scene.time.addEvent({
        delay: repeatGap,
        callback: () => {
            let [x, y] = getRandomPosition(scene.m_player.x, scene.m_player.y);
            scene.m_mobs.add(new Mob(scene, x, y, mobTexture, mobAnim, mobHp, mobDropRate));
        },
        loop: true,
    });

    scene.m_mobEvents.push(timer);
}

export function removeOldstMobEvent(scene) {
    scene.m_mobEvents[0].return();
    scene.m_mobEvents.shift();
}