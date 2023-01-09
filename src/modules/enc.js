import { Player, getStats } from "./player";
import map from "./map";
import { rand, vary } from "./util";
import {
  ENC_HP_MIN,
  ENC_DEX_MIN,
  ENC_STR_MIN,
  ENC_GP_MAX,
  USER_STAT_POOL,
} from "./constants";
import { v4 as uuid } from "uuid";
import { writable } from "svelte/store";

function createEnc() {
  let name = "enc"; //uuid().substring(0, 8);
  let lvl = Math.max(
    1,
    Math.ceil(vary(map.location().distance, 0.1) / vary(50, 0.25))
  );

  let stats = getStats(USER_STAT_POOL * lvl);
  let hp = stats.hp + ENC_HP_MIN;
  let str = stats.str + ENC_STR_MIN;
  let dex = stats.dex + ENC_DEX_MIN;
  let gp = rand(ENC_GP_MAX);
  let xp = Math.ceil(vary(hp + str + dex) / 2);

  return new Player(name, lvl, hp, str, dex, xp, gp);
}

export function init() {
  let e = createEnc();
  console.log(JSON.stringify(e));
  enc.set(e);
  misses.set(0);
}

export const misses = writable(0);

const enc = writable();

export default enc;
