import { rand } from "./util";
import {
  USER_HP_MIN,
  USER_STR_MIN,
  USER_DEX_MIN,
  USER_STAT_POOL,
} from "./constants";
import { v4 as uuid } from "uuid";
import { writable } from "svelte/store";

function createUser() {
  let name = ""; //uuid().substring(0, 8);

  let pool = USER_STAT_POOL;
  let hp = rand(pool);
  pool -= hp;
  let str = rand(pool);
  pool -= str;
  let dex = pool;
  hp += USER_HP_MIN;
  str += USER_STR_MIN;
  dex += USER_DEX_MIN;

  let maxhp = hp;
  let steps = 0;
  let gp = 0;

  return {
    name,
    hp,
    maxhp,
    str,
    dex,
    steps,
    gp,
  };
}

const user = writable(createUser());

export function init() {
  user.set(createUser());
}

export default user;
