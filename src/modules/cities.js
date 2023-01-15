import map from "./map";
import { Item, items as allItems } from "./items";
import { rand, vary } from "./util";
import { INN_COST } from "./constants";
import { v4 as uuid } from "uuid";

let cities = new Map();

class City {
  constructor(name, innCost, items) {
    this.name = name;
    this.innCost = innCost;
    this.items = items;
  }
}

function createCity() {
  let name = uuid().substring(0, 8);
  let wealthFactor = Math.random() + 0.5;
  let distance = map.location().distance;
  let innCost = vary(INN_COST * wealthFactor * (distance + 1));
  let r = rand(100);
  let items = allItems
    .filter((i) => r < i.freq)
    .map((i) => new Item(i.name, i.effect, vary(i.value * wealthFactor)));
  return new City(name, innCost, items);
}

export function getCity(x, y) {
  let k = `${x}.${y}`;
  if (!cities.has(k)) {
    cities.set(k, createCity());
  }
  return cities.get(k);
}

export function clearCities() {
  cities.clear();
}
