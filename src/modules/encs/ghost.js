import enc, { misses } from "../enc";
import user, { evades } from "../user";
import { strike, dmgMsg } from "../battle";
import toast from "../toast";
import { rand, increment } from "../util";
import { USER_TOAST } from "../constants";
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
}
