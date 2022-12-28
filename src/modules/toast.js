import { toast as sveltetoast } from "@zerodevx/svelte-toast";

function show(message, target = undefined) {
  let options = target ? { target } : undefined;
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
