import { rand } from "./util";
import { USER_STAT_POOL } from "./constants";

export class Player {
  constructor(name, lvl, hp, str, dex, xp, gp) {
    this.name = name;
    this.lvl = lvl;
    this.hpbase = hp;
    this.strbase = str;
    this.dexbase = dex;
    this.hp = hp;
    this.str = str;
    this.dex = dex;
    this.xp = xp;
    this.gp = gp;
    this.status = {
      evading: false,
      fleeing: false,
    };
  }

  evading = () => this.status.evading;
  fleeing = () => this.status.fleeing;

  ko = () => this.hp <= 0;
}

export function getStats(pool, strWeight, dexWeight) {
  pool ??= 10;
  strWeight ??= 1;
  dexWeight ??= 1;

  let strPool = Math.round((pool * strWeight) / (strWeight + dexWeight));
  let dexPool = Math.round((pool * dexWeight) / (strWeight + dexWeight));
  let strMin = Math.min(Math.max(strPool - dexPool, 0), strPool - 1);
  let dexMin = Math.min(Math.max(dexPool - strPool, 0), dexPool - 1);

  let str = rand(strPool, strMin);
  pool -= str;
  let dex = rand(dexPool, dexMin);
  pool -= dex;
  let hp = Math.max(pool, 0);

  return {
    hp,
    str,
    dex,
  };
}
