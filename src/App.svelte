<script>
  import Title from "./lib/Title.svelte";
  import Map from "./lib/Map.svelte";
  import Menu from "./lib/Menu.svelte";
  import Enc from "./lib/Enc.svelte";
  import City from "./lib/City.svelte";
  import Sleep from "./lib/Sleep.svelte";
  import Toast from "./lib/components/Toast.svelte";
  import { screenStore, SCREENS } from "./modules/screens";
  import toast from "./modules/toast";
  import { wait } from "./modules/util";
  import { SCREEN_FADE_DURATION } from "./modules/constants";
  import { onMount, onDestroy } from "svelte";

  let unsubscribe;

  onMount(() => {
    unsubscribe = screenStore.subscribe((value) => {
      screen = undefined;
      toast.clear();
      wait(SCREEN_FADE_DURATION, () => {
        screen = value;
      });
    });
  });

  onDestroy(unsubscribe);

  let screen;
</script>

<main>
  <Toast />
  {#if screen == SCREENS.TITLE}
    <Title />
  {:else if screen == SCREENS.MAP}
    <Map />
  {:else if screen == SCREENS.MENU}
    <Menu />
  {:else if screen == SCREENS.ENC}
    <Enc />
  {:else if screen == SCREENS.CITY}
    <City />
  {:else if screen == SCREENS.SLEEP}
    <Sleep />
  {/if}
</main>

<style>
  :global(.view) {
    height: 360px;
    width: 360px;
    font-family: "Averia Libre";
    overflow: hidden;
  }

  :global(.ctrls) {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  :global(.ctrls button[disabled]) {
    border: none;
    cursor: default;
  }
</style>
