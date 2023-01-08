import { Player, getStats } from "./player";
import { rand, vary } from "./util";
import { ENC_HP_MIN, ENC_DEX_MIN, ENC_STR_MIN, ENC_GP_MAX } from "./constants";
import { v4 as uuid } from "uuid";
import { writable } from "svelte/store";

function createEnc() {
  let name = ""; //uuid().substring(0, 8);
  let lvl = 1;

  let stats = getStats();
  let hp = stats.hp + ENC_HP_MIN;
  let str = stats.str + ENC_STR_MIN;
  let dex = 1; //stats.dex + ENC_DEX_MIN;
  let gp = rand(ENC_GP_MAX);
  let xp = Math.ceil(vary(hp + str + dex) / 2);

  return new Player(name, lvl, hp, str, dex, xp, gp);
}

export function init() {
  enc.set(createEnc());
}

const enc = writable();

export default enc;
