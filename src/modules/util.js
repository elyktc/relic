import { VARIANCE } from "./constants";
import { get } from "svelte/store";

export function rand(max, min) {
  max = Math.round(max ?? 0);
  min = Math.round(min ?? 0);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function wait(duration, callback) {
  setTimeout(callback, duration);
}

export function vary(amount, pct) {
  pct ??= VARIANCE;
  let diff = Math.ceil(Math.abs(amount * pct));
  return rand(amount + diff, amount - diff);
}

export function format(number) {
  return new Intl.NumberFormat().format(number);
}

export function increment(store) {
  update(store, (val) => val++);
}

export function update(store, f) {
  let s = get(store);
  f(s);
  store.set(s);
}
