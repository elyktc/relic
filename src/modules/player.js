import { rand } from "./util";
import { USER_STAT_POOL } from "./constants";

export class Player {
  constructor(name, lvl, hp, str, dex, xp, gp) {
    this.name = name;
    this.lvl = lvl;
    this.maxhp = hp;
    this.hp = hp;
    this.str = str;
    this.dex = dex;
    this.xp = xp;
    this.gp = gp;
    this.status = {
      blocking: false,
      fleeing: false,
    };
  }

  block = () => (this.status.blocking = true);
  flee = () => (this.status.fleeing = true);

  blocking = () => this.status.blocking;
  fleeing = () => this.status.fleeing;

  ko = () => this.hp <= 0;
}

export function getStats() {
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
