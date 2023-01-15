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

function getDmg(source, target) {
  let hitPct = source.dex / Math.max(source.dex + target.dex, 1);
  if (target.evading()) {
    hitPct = hitPct / 2;
  }
  hitPct = Math.ceil(hitPct * 100);
  if (rand(100) * HIT_LUCK < hitPct) {
    return vary(source.str);
  }
  return undefined;
}

function strike(s, t, sourceToast, targetToast) {
  let source = get(s);
  let target = get(t);
  let dmg = getDmg(source, target);
  if (dmg) {
    target.hp -= dmg;
    if (target.evading()) {
      target.status.evading = false;
    }
    t.set(target);
  } else if (dmg === undefined && target.evading()) {
    let counterDmg = vary(Math.max(Math.floor(target.str / 2), 1));
    source.hp -= counterDmg;
    s.set(source);
    toast.show(dmgMsg(counterDmg), sourceToast);
  }
  toast.show(dmgMsg(dmg), targetToast);
  return dmg;
}

export function encStrike() {
  let dmg = strike(enc, user, ENC_TOAST, USER_TOAST);
  if (dmg) {
    misses.set(0);
  } else if (dmg === undefined) {
    increment(misses);
    let u = get(user);
    if (u.evading()) {
      increment(evades);
    }
  }
  return dmg;
}

export function userStrike() {
  let u = get(user);
  if (u.evading()) {
    u.status.evading = false;
    user.set(u);
  }
  let dmg = strike(user, enc, USER_TOAST, ENC_TOAST);
  if (dmg) {
    increment(strikes);
    let e = get(enc);
    if (e.ko()) {
      increment(kills);
    }
  }
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

const dmgMsg = (dmg) => (dmg === undefined ? "Miss" : `${dmg}`);
