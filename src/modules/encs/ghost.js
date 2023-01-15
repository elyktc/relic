import enc from "../enc";
import { encStrike } from "../battle";
import { rand } from "../util";
import { get } from "svelte/store";

export function act() {
  if (rand(1) == 1) {
    return;
  }
  let e = get(enc);
  if (rand(1) == 1) {
    e.status.fleeing = true;
    enc.set(e);
  } else {
    encStrike();
  }
}
