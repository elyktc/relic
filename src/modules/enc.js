import { rand } from "./util";
import { ENC_HP_MAX, ENC_HP_MIN, ENC_STR_MAX, ENC_STR_MIN } from "./constants";
import { v4 as uuid } from "uuid";
import { writable } from "svelte/store";

function createEnc() {
  let name = ""; //uuid().substring(0, 8);
  let hp = rand(ENC_HP_MAX, ENC_HP_MIN);
  let str = rand(ENC_STR_MAX, ENC_STR_MIN);
  let maxhp = hp;

  return {
    name,
    hp,
    maxhp,
    str,
  };
}

const enc = writable(createEnc());

export function init() {
  enc.set(createEnc());
}

export default enc;
