import { rand, vary } from "./util";
import {
  ENC_HP_MIN,
  ENC_DEX_MIN,
  ENC_STR_MIN,
  USER_STAT_POOL,
  ENC_GP_MAX,
} from "./constants";
import { v4 as uuid } from "uuid";
import { writable } from "svelte/store";

function createEnc() {
  let name = ""; //uuid().substring(0, 8);

  let pool = USER_STAT_POOL;
  let hp = rand(pool);
  pool -= hp;
  let str = rand(pool);
  pool -= str;
  let dex = pool;
  hp += ENC_HP_MIN;
  str += ENC_STR_MIN;
  dex += ENC_DEX_MIN;

  let maxhp = hp;
  let gp = rand(ENC_GP_MAX);
  let xp = Math.ceil(vary(maxhp + str + dex) / 2);
  let lvl = 1;

  return {
    name,
    hp,
    maxhp,
    str,
    dex,
    gp,
    xp,
    lvl,
    ko() {
      return this.hp <= 0;
    }
  };
}

export function init() {
  enc.set(createEnc());
}

const enc = writable(createEnc());

export default enc;
