import { Player, getStats } from "./player";
import { encStrike } from "./battle";
import map, { TERRAINS } from "./map";
import * as dragon from "./encs/dragon";
import * as ghost from "./encs/ghost";
import * as rat from "./encs/rat";
import { rand, update, vary } from "./util";
import {
  ENC_HP_MIN,
  ENC_DEX_MIN,
  ENC_STR_MIN,
  ENC_GP_MAX,
  STAT_POOL,
} from "./constants";
import { writable, get } from "svelte/store";

export function init() {
  let r = rand(100);
  let loc = map.location();
  let lvl = vary(loc.distance, 0.1) / vary(50, 0.25);
  lvl = Math.ceil(Math.max(lvl, 1));
  let encs = encList.filter(
    (e) =>
      r < e.freq &&
      lvl >= e.minLvl &&
      lvl <= e.maxLvl &&
      e.at(loc.terrain, loc.nearby)
  );
  if (encs.length) {
    encs[rand(encs.length - 1)].init(lvl);
  } else {
    rat.init(lvl);
  }
  console.log(JSON.stringify(get(enc)));
  if (!get(act)) {
    act.set(defaultAct);
  }
  misses.set(0);
}

export const icon = writable();
export const act = writable();
export const misses = writable(0);

const enc = writable();
export default enc;

function defaultInit(lvl, icons, encAct) {
  let name = "enc";
  let stats = getStats(STAT_POOL * lvl);
  let hp = stats.hp + ENC_HP_MIN;
  let str = stats.str + ENC_STR_MIN;
  let dex = stats.dex + ENC_DEX_MIN;
  let gp = rand(ENC_GP_MAX);
  let xp = Math.ceil(vary(hp + str + dex) / 2);

  enc.set(new Player(name, lvl, hp, str, dex, xp, gp));
  act.set(encAct ?? defaultAct);
  icon.set(icons[rand(icons.length - 1)]);
}

function defaultAct() {
  if (get(misses) > 3 && rand(1) == 1) {
    update(enc, (e) => (e.status.fleeing = true));
  } else {
    encStrike();
  }
}

class EncInfo {
  constructor(encInit, freq, minLvl, maxLvl, terrains, near) {
    this.init = encInit;
    this.freq = freq;
    this.minLvl = minLvl;
    this.maxLvl = maxLvl;
    this.terrains = terrains;
    this.near = near ?? [];
  }

  at = (t, ts) =>
    this.terrains.includes(t) || this.near.filter((n) => ts.includes(n)).length;
}

let basicInit = (lvl) => defaultInit(lvl, ["wolf", "boar"]);
let fencerInit = (lvl) => defaultInit(lvl, ["fencer"]);
let ghostInit = (lvl) => defaultInit(lvl, ["ghost"], ghost.act);

const encList = [
  new EncInfo(rat.init, 100, 1, 1, [TERRAINS.PLAIN]),
  new EncInfo(basicInit, 100, 1, 100, [TERRAINS.PLAIN, TERRAINS.FOREST]),
  new EncInfo(fencerInit, 100, 1, 100, [], [TERRAINS.CITY]),
  new EncInfo(ghostInit, 50, 2, 100, [TERRAINS.FOREST]),
  new EncInfo(dragon.init, 20, 3, 100, [TERRAINS.PLAIN, TERRAINS.FOREST]),
];
