import { VARIANCE } from "./constants";

export function rand(max, min) {
  max ??= 0;
  min ??= 0;
  return Math.floor(Math.random() * (max - min)) + min;
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
