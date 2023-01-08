import { Player, getStats } from "./player";
import { USER_HP_MIN, USER_STR_MIN, USER_DEX_MIN } from "./constants";
import { v4 as uuid } from "uuid";
import { writable, get } from "svelte/store";

function createUser() {
  let name = ""; //uuid().substring(0, 8);
  let lvl = 1;

  var stats = getStats();
  let hp = stats.hp + USER_HP_MIN;
  let str = stats.str + USER_STR_MIN;
  let dex = stats.dex + USER_DEX_MIN;
  let gp = 0;
  let xp = 0;

  return new Player(name, lvl, hp, str, dex, xp, gp);
}

export function nextXp() {
  let u = get(user);
  return Math.pow(u.lvl, 3) + u.lvl * 200 + -1;
}

export function levelUp() {
  let u = get(user);
  u.lvl++;
  let stats = getStats();
  u.maxhp += stats.hp;
  u.hp = u.maxhp;
  u.str += stats.str;
  u.dex += stats.dex;
  user.set(u);
}

export function init() {
  user.set(createUser());
}

const user = writable();

export default user;
