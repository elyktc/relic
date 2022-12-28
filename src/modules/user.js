import { rand } from "./util";
import {
  USER_HP_MAX,
  USER_HP_MIN,
  USER_STR_MAX,
  USER_STR_MIN,
} from "./constants";
import { v4 as uuid } from "uuid";
import { writable } from "svelte/store";

function createUser() {
  let name = ""; //uuid().substring(0, 8);
  let hp = rand(USER_HP_MAX, USER_HP_MIN);
  let str = rand(USER_STR_MAX, USER_STR_MIN);
  let maxhp = hp;
  let steps = 0;
  let gp = 0;

  return {
    name,
    hp,
    maxhp,
    str,
    steps,
    gp,
  };
}

const user = writable(createUser());

export function init() {
  user.set(createUser());
}

export default user;
