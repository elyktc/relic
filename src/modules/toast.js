import { toast as sveltetoast } from "@zerodevx/svelte-toast";

function show(message, target = undefined, green = false) {
  let options = target ? { target } : undefined;
  if (green) {
    options ??= options;
    options.theme = { "--toastColor": "green" };
  }
  sveltetoast.push(message, options);
}

function persist(message, target = undefined) {
  let options = {
    initial: 0,
    next: 0,
    //dismissable: true,
  };
  if (target) options.target = target;
  sveltetoast.push(message, options);
}

function clear() {
  sveltetoast.pop(0);
}

export default {
  show,
  persist,
  clear,
};
