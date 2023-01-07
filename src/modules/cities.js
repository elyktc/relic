import { rand } from "./util";
import { INN_MIN, INN_MAX } from "./constants";
import { v4 as uuid } from "uuid";

let cities = new Map();

function City(name, innCost) {
  this.name = name;
  this.innCost = innCost;
}

function createCity() {
  let name = uuid().substring(0, 8);
  let innCost = rand(INN_MIN, INN_MAX);
  return new City(name, innCost);
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
