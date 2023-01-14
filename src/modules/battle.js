import user, { strikes, evades, kills, nextXp, levelUp } from "./user";
import enc, { misses } from "./enc";
import toast from "./toast";
import { rand, vary, increment } from "./util";
import {
  HIT_LUCK,
  BATTLE_SPEED,
  USER_SPEED,
  ENC_TOAST,
  USER_TOAST,
} from "./constants";
import { get } from "svelte/store";

export function strike(src, target) {
  let hitPct = src.dex / Math.max(src.dex + target.dex, 1);
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
  toast.show(dmgMsg(dmg), ENC_TOAST);
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

export function getEncSpeed(encDex, userDex) {
  return Math.ceil((userDex / Math.max(encDex, 1)) * 1000 * BATTLE_SPEED);
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
    toast.persist(`Gained ${xp} experience`, ENC_TOAST);
  }
  if (e.gp && !e.fleeing()) {
    u.gp += e.gp;
    toast.persist(`Found ${e.gp} gold`, ENC_TOAST);
  }
  user.set(u);
  if (u.xp >= next) {
    levelUp();
    toast.persist(`Level up!`, ENC_TOAST);
  }
}

export const dmgMsg = (dmg) => (dmg === undefined ? "Miss" : `${dmg}`);
