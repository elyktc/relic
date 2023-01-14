import { Player, getStats } from "../player";
import enc, { act as encAct, icon } from "../enc";
import { vary } from "../util";
import { USER_STAT_POOL } from "../constants";

export function init(lvl) {
  let name = "enc"; //uuid().substring(0, 8);
  let stats = getStats((USER_STAT_POOL / 2) * lvl);
  let hp = stats.hp + 1;
  let str = stats.str + 1;
  let dex = stats.dex + 1;
  let gp = 0;
  let xp = Math.ceil(vary(hp + str + dex) / 2);

  enc.set(new Player(name, lvl, hp, str, dex, xp, gp));
  encAct.set(undefined);
  icon.set("rat");
}
