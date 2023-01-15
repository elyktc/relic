import { Player, getStats } from "../player";
import enc, { act as encAct, icon } from "../enc";
import { encStrike } from "../battle";
import { rand, vary } from "../util";
import { ENC_HP_MIN, ENC_STR_MIN, ENC_GP_MAX, STAT_POOL } from "../constants";

export function init(lvl) {
  let name = "enc";
  let stats = getStats(STAT_POOL * lvl);
  let hp = stats.hp + ENC_HP_MIN * 3;
  let str = stats.str + ENC_STR_MIN * 2;
  let dex = Math.ceil(stats.dex / 2);
  let gp = rand(ENC_GP_MAX * 5);
  let xp = Math.ceil(vary(hp + str + dex) / 2);

  enc.set(new Player(name, lvl, hp, str, dex, xp, gp));
  encAct.set(act);
  icon.set("dragon");
}

function act() {
  encStrike();
}
