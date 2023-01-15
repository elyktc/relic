import { writable, get } from "svelte/store";

export let items = writable([]);
export let itemSelection = writable();

export function acquire(item) {
  let inventory = get(items);
  let stock = inventory.find((i) => i.name === item.name);
  if (stock) {
    stock.qty++;
  } else {
    inventory.push(new InventoryItem(item.name, item.effect, 1));
  }
  items.set(inventory);
}

export function discard(item) {
  let inventory = get(items);
  let index = inventory.findIndex((i) => i.name === item.name);
  if (index > -1) {
    if (inventory[index].qty > 1) {
      inventory[index].qty--;
    } else {
      inventory.splice(index, 1);
    }
    items.set(inventory);
  }
}

export function use(item) {
  if (item.effect) {
    item.effect();
    discard(item);
  }
}

class InventoryItem {
  constructor(name, effect, qty) {
    this.name = name;
    this.effect = effect;
    this.qty = qty;
  }
}
