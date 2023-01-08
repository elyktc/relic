import user from "./user";
import enc from "./enc";
import toast from "./toast";
import { rand, vary } from "./util";
import { HIT_LUCK, BATTLE_SPEED, USER_SPEED } from "./constants";
import { writable, get } from "svelte/store";

function hit(src, target) {
  let hitPct;
  if (src.dex > target.dex) {
    hitPct = 1 - target.dex / src.dex;
  } else {
    hitPct = src.dex / target.dex;
  }
  hitPct = Math.ceil(hitPct * 100);
  if (rand(100) * HIT_LUCK < hitPct) {
    let dmg = vary(src.str);
    if (target.blocking()) {
      dmg = Math.ceil(dmg / 4);
    }
    return dmg;
  }
  return undefined;
}

export function userHit() {
  let u = get(user);
  let e = get(enc);
  let dmg = hit(u, e);
  if (dmg) {
    e.hp -= dmg;
    enc.set(e);
  } else if (dmg === undefined) {
    user.set(u);
  }
  toast.show(dmgMsg(dmg), "enc");
}

export function encHit() {
  let u = get(user);
  let e = get(enc);
  let misses = get(encMisses);
  if (misses > 3 && rand(1) == 1) {
    e.flee();
    enc.set(e);
  } else {
    let dmg = hit(e, u);
    if (dmg) {
      u.hp -= dmg;
      user.set(u);
      if (misses) {
        encMisses.set(0);
      }
    } else if (dmg === undefined) {
      encMisses.set(++misses);
      enc.set(e);
    }
    toast.show(dmgMsg(dmg), "user");
  }
}

export function getEncSpeed(encDex, userDex) {
  return Math.ceil((userDex / encDex) * 1000 * BATTLE_SPEED);
}

export function getUserSpeed() {
  return USER_SPEED * BATTLE_SPEED;
}

export const encMisses = writable(0);

const dmgMsg = (dmg) => (dmg === undefined ? "Miss" : `${dmg}`);
