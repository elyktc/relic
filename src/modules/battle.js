import { rand, vary } from "./util";
import { HIT_LUCK, BATTLE_SPEED, USER_SPEED } from "./constants";

export function hit(src, target) {
  let hitPct;
  if (src.dex > target.dex) {
    hitPct = 1 - target.dex / src.dex;
  } else {
    hitPct = src.dex / target.dex;
  }
  hitPct = Math.ceil(hitPct * 100);
  if (rand(100) < hitPct * HIT_LUCK) {
    return vary(src.str);
  }
  return undefined;
}

export function getEncSpeed(encDex, userDex) {
  return Math.ceil((userDex / encDex) * 1000 * BATTLE_SPEED);
}

export function getUserSpeed() {
  return USER_SPEED * BATTLE_SPEED;
}
