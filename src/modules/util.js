export function rand(max, min) {
  max ??= 0;
  min ??= 0;
  return Math.floor(Math.random() * (max - min)) + min;
}

export function wait(duration, callback) {
  setTimeout(callback, duration);
}
