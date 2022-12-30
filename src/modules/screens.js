import { wait } from "./util";
import { SCREEN_FADE_DURATION } from "./constants";
import { writable } from "svelte/store";
import { fade } from "svelte/transition";

const SCREENS = {
  TITLE: 0,
  MAP: 1,
  MENU: 2,
  ENC: 3,
  CITY: 4,
  SLEEP: 5,
};

const screenStore = writable(SCREENS.TITLE);

function showMapScreen() {
  screenStore.set(SCREENS.MAP);
}

function showMenuScreen() {
  screenStore.set(SCREENS.MENU);
}

function showEncScreen() {
  screenStore.set(SCREENS.ENC);
}

function showTitleScreen() {
  screenStore.set(SCREENS.TITLE);
}

function showCityScreen() {
  screenStore.set(SCREENS.CITY);
}

function showSleepScreen() {
  screenStore.set(SCREENS.SLEEP);
}

function screenFade(node) {
  return fade(node, { duration: SCREEN_FADE_DURATION });
}

export {
  screenStore,
  SCREENS,
  screenFade,
  showMapScreen,
  showMenuScreen,
  showEncScreen,
  showTitleScreen,
  showCityScreen,
  showSleepScreen,
};
