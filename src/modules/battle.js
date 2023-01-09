import user, { strikes, evades, kills, nextXp, levelUp } from "./user";
import enc, { misses } from "./enc";
import toast from "./toast";
import { rand, vary, increment } from "./util";
import { HIT_LUCK, BATTLE_SPEED, USER_SPEED } from "./constants";
import { get } from "svelte/store";

function strike(src, target) {
  let hitPct = src.dex / (src.dex + target.dex);
  if (target.evading()) {
    hitPct = hitPct / 4;
  }
  hitPct = Math.ceil(hitPct * 100);
  if (rand(100) * HIT_LUCK < hitPct) {
    let dmg = vary(src.str);
    return dmg;
  }
  return undefined;
}

export function userStrike() {
  let u = get(user);
  if (u.evading()) {
    u.status.evading = false;
    user.set(u);
  }
  let e = get(enc);
  let dmg = strike(u, e);
  if (dmg) {
    e.hp -= dmg;
    enc.set(e);
    increment(strikes);
    if (e.ko()) {
      increment(kills);
    }
  }
  toast.show(dmgMsg(dmg), "enc");
}

export function userEvade() {
  let u = get(user);
  u.status.evading = true;
  user.set(u);
}

export function userFlee() {
  let u = get(user);
  u.status.fleeing = true;
  var drop = rand(Math.floor(u.gp / 2));
  u.gp -= drop;
  if (drop) {
    toast.show(`Dropped ${drop} gold`);
  }
  user.set(u);
}

export function encStrike() {
  let e = get(enc);
  if (get(misses) > 3 && rand(1) == 1) {
    e.status.fleeing = true;
    enc.set(e);
  } else {
    let u = get(user);
    let dmg = strike(e, u);
    if (dmg) {
      u.hp -= dmg;
      user.set(u);
      misses.set(0);
    } else if (dmg === undefined) {
      increment(misses);
      if (u.evading()) {
        increment(evades);
      }
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

export function loot() {
  let u = get(user);
  let e = get(enc);
  let xp = e.xp;
  let next = nextXp();
  if (e.fleeing()) {
    xp *= 1 - e.hp / e.hpbase;
    xp = Math.floor(Math.min(xp, next - u.xp - 1));
  }
  xp = Math.ceil((xp * e.lvl) / u.lvl);
  if (xp) {
    u.xp += xp;
    toast.persist(`Gained ${xp} experience`, "enc");
  }
  if (e.gp && !e.fleeing()) {
    u.gp += e.gp;
    toast.persist(`Found ${e.gp} gold`, "enc");
  }
  user.set(u);
  if (u.xp >= next) {
    levelUp();
    toast.persist(`Level up!`, "enc");
  }
}

const dmgMsg = (dmg) => (dmg === undefined ? "Miss" : `${dmg}`);
