import { writable } from "svelte/store";
import { fade } from "svelte/transition";
import { SCREEN_FADE_DURATION } from "./constants";

const SCREENS = {
  TITLE: 0,
  MAP: 1,
  MENU: 2,
  ENC: 3,
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
};
