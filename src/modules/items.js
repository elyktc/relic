import user from "./user";
import enc from "./enc";
import toast from "./toast";
import { SCREENS, screenStore } from "./screens";
import { update, vary } from "./util";
import { get } from "svelte/store";
import { ENC_TOAST, USER_TOAST } from "./constants";

export class Item {
  constructor(name, effect, value, freq) {
    this.name = name;
    this.effect = effect;
    this.value = value;
    this.freq = freq;
  }
}

export const items = [
  new Item("Potion", potionEffect, 50, 100),
  new Item("Grenade", grenadeEffect, 100, 50),
];

function potionEffect() {
  let recovery = vary(50);
  update(user, (u) => (u.hp = Math.min(u.hp + recovery, u.hpbase)));
  if (inEnc) {
    toast.show(recovery, USER_TOAST, true);
  }
}

function grenadeEffect() {
  let dmg = vary(50);
  if (inEnc) {
    update(enc, (e) => (e.hp -= dmg));
    toast.show(dmg, ENC_TOAST);
  }
}

let inEnc = () => get(screenStore) === SCREENS.ENC;
