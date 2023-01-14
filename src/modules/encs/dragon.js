import { Player, getStats } from "../player";
import user, { evades } from "../user";
import enc, { act as encAct, icon, misses } from "../enc";
import { strike, dmgMsg } from "../battle";
import toast from "../toast";
import { rand, vary, increment } from "../util";
import {
  ENC_HP_MIN,
  ENC_STR_MIN,
  ENC_GP_MAX,
  USER_STAT_POOL,
  USER_TOAST,
} from "../constants";
import { get } from "svelte/store";

export function init(lvl) {
  let name = "enc"; //uuid().substring(0, 8);
  let stats = getStats(USER_STAT_POOL * lvl);
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
  let e = get(enc);
  let u = get(user);
  let dmg = strike(e, u);
  if (dmg) {
    u.hp -= dmg;
    user.set(u);
    misses.set(0);
  } else if (dmg === undefined) {
    increment(misses);
    if (u.evading()) {
      increment(evades);
    }
  }
  toast.show(dmgMsg(dmg), USER_TOAST);
}
