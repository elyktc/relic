import { rand, vary } from "./util";
import {
  USER_HP_MIN,
  USER_STR_MIN,
  USER_DEX_MIN,
  USER_STAT_POOL,
} from "./constants";
import { v4 as uuid } from "uuid";
import { writable } from "svelte/store";

function getStats() {
  let pool = USER_STAT_POOL;
  let hp = rand(pool);
  pool -= hp;
  let str = rand(pool);
  pool -= str;
  let dex = pool;

  return {
    hp,
    str,
    dex,
  };
}

function createUser() {
  let name = ""; //uuid().substring(0, 8);

  var stats = getStats();
  let hp = stats.hp + USER_HP_MIN;
  let str = stats.str + USER_STR_MIN;
  let dex = stats.dex + USER_DEX_MIN;
  let maxhp = hp;
  let steps = 0;
  let gp = 0;
  let xp = 0;
  let lvl = 1;
  let next = vary((maxhp + stats.str + stats.dex) * 2);

  return {
    name,
    hp,
    maxhp,
    str,
    dex,
    steps,
    gp,
    lvl,
    xp,
    next,
    ko() {
      return this.hp <= 0;
    },
  };
}

export function levelUp(u) {
  let stats = getStats();
  u.maxhp += stats.hp;
  u.hp = u.maxhp;
  u.str += stats.str;
  u.dex += stats.dex;
  u.next += vary((u.maxhp + u.str + u.dex) * 2);
  u.lvl++;
  user.set(u);
}

export function init() {
  user.set(createUser());
}

const user = writable(createUser());

export default user;
