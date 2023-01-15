import { Player, getStats } from "./player";
import {
  USER_HP_MIN,
  USER_STR_MIN,
  USER_DEX_MIN,
  STAT_POOL,
} from "./constants";
import { writable, get } from "svelte/store";
import { v4 as uuid } from "uuid";

function createUser() {
  let name = "user"; //uuid().substring(0, 8);
  let lvl = 1;

  var stats = getStats();
  let hp = stats.hp + USER_HP_MIN;
  let str = stats.str + USER_STR_MIN;
  let dex = stats.dex + USER_DEX_MIN;
  let gp = 0;
  let xp = 0;

  return new Player(name, lvl, hp, str, dex, xp, gp);
}

export function nextXp(u) {
  u ??= get(user);
  return Math.pow(u.lvl, 3) + u.lvl * 200 - 1;
}

export function levelUp() {
  let u = get(user);
  let s = get(strikes);
  let e = get(evades);
  while (u.xp > nextXp(u)) {
    u.lvl++;
    let pool = Math.round(STAT_POOL / 2);
    let stats = getStats(pool, s, e);
    u.hpbase += stats.hp + pool;
    u.strbase = Math.max(u.strbase + stats.str, 1);
    u.dexbase = Math.max(u.dexbase + stats.dex, 1);
    s = undefined;
    e = undefined;
  }
  u.hp = u.hpbase;
  u.str = u.strbase;
  u.dex = u.dexbase;
  user.set(u);
  strikes.set(0);
  evades.set(0);
}

export function init() {
  let u = createUser();
  console.log(JSON.stringify(u));
  user.set(u);
  strikes.set(0);
  evades.set(0);
  kills.set(0);
}

export const strikes = writable(0);
export const evades = writable(0);
export const kills = writable(0);

const user = writable();

export default user;
