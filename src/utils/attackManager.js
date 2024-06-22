import Beam from "../effacts/Beam"
import Claw from "../effacts/Claw"
import Catnip from "../effacts/Catnip";



export function addAttackEvent(scene, attackType, attackDamage, attackScale, repeatGap = 0) {
    switch (attackType) {
        case "claw":
        case "beam":
            const timerBeam = scene.time.addEvent({
                delay: repeatGap,
                callback: () => {
                    shootBeam(scene, attackDamage, attackScale);
                },
                loop: true,
            })
            scene.m_attackEvents.beam = timerBeam;
            break;
        case "catnip":
            const catnip = new Catnip(scene, [scene.m_player.x, scene.m_player.y + 20], damage, scale);
            scene.m_attackEvents[attackType] = { object: catnip, damage: damage };
            break;
        default:
            break;
    }
}

function doAttackOneSet(scene, attackType, damage, scale) {
    switch (attackType) {
        // beam은 하나를 쏘는 것이 한 세트입니다.
        case "beam":
            new Beam(scene, [scene.m_player.x, scene.m_player.y - 16], damage, scale);
            break;

        // claw는 플레이어의 앞쪽 공격 1번, 뒤쪽 공격 1번이 한 세트입니다.
        // isHeadingRight은 플레이어가 바라보는 방향에 따라 claw 이미지를 적절히 나타내기 위한 변수입니다.
        case "claw":
            const isHeadingRight = scene.m_player.flipX;
            new Claw(scene,
                [scene.m_player.x - 60 + 120 * isHeadingRight, scene.m_player.y - 40],
                isHeadingRight,
                damage,
                scale);
            // 앞쪽 공격, 뒤쪽 공격 사이의 시간 간격은 0.5s로 설정했습니다.
            scene.time.addEvent({
                delay: 500,
                callback: () => {
                    new Claw(scene,
                        [scene.m_player.x - 60 + 120 * !isHeadingRight, scene.m_player.y - 40],
                        !isHeadingRight,
                        damage,
                        scale);
                },
                loop: false,
            });
            break;
    }
}

function shootBeam(scene, damage, scale) {
    return new Beam(scene, [scene.m_player.x, scene.m_player.y - 16], damage, scale)
}
// scene에 있는 attackType의 공격을 제거해주는 함수입니다.
export function removeAttack(scene, attackType) {
    // catnip의 경우 object를 제거합니다.
    if (attackType === "catnip") {
        scene.m_attackEvents[attackType].object.destroy();
        return;
    }

    // 다른 공격(beam, claw)의 경우 설정했던 timer를 비활성화합니다.
    scene.time.removeEvent(scene.m_attackEvents[attackType].timer);
}

// scene에 있는 attackType 공격의 damage를 재설정해주는 함수입니다.
export function setAttackDamage(scene, attackType, newDamage) {
    const scale = scene.m_attackEvents[attackType].scale;
    const repeatGap = scene.m_attackEvents[attackType].repeatGap;
    removeAttack(scene, attackType);
    addAttackEvent(scene, attackType, newDamage, scale, repeatGap);
}

// scene에 있는 attackType 공격의 scale을 재설정해주는 함수입니다.
export function setAttackScale(scene, attackType, newScale) {
    const damage = scene.m_attackEvents[attackType].damage;
    const repeatGap = scene.m_attackEvents[attackType].repeatGap;
    removeAttack(scene, attackType);
    addAttackEvent(scene, attackType, damage, newScale, repeatGap);
}

// scene에 있는 attackType 공격의 repeatGap을 재설정해주는 함수입니다.
export function setAttackRepeatGap(scene, attackType, newRepeatGap) {
    // catnip의 경우 repeatGap이 없으므로 예외처리해 줍니다.
    if (attackType === 'catnip') {
        console.error("Cannot set catnip's repeat gap");
        return;
    }

    const damage = scene.m_attackEvents[attackType].damage;
    const scale = scene.m_attackEvents[attackType].scale;
    removeAttack(scene, attackType);
    addAttackEvent(scene, attackType, damage, scale, newRepeatGap);
}

// Beam의 지속시간을 설정해주는 함수입니다. (ms단위)
// newRepeatGap, newScale와 같은 값이 변경이 되었을 때 지속시간도 올리도록 코드를 짜도록 하겠습니다.
// export function setBeamDuration(duration) {
//     Beam.DURATION = duration;
// }