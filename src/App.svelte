<script>
  import Title from "./lib/Title.svelte";
  import Map from "./lib/Map.svelte";
  import Menu from "./lib/Menu.svelte";
  import Enc from "./lib/Enc.svelte";
  import Toast from "./lib/components/Toast.svelte";
  import { screenStore, SCREENS } from "./modules/screens";
  import toast from "./modules/toast";
  import { wait } from "./modules/util";
  import { SCREEN_FADE_DURATION } from "./modules/constants";

  function init(node) {
    screenStore.subscribe((value) => {
      screen = undefined;
      toast.clear();
      wait(SCREEN_FADE_DURATION, () => {
        screen = value;
      });
    });
  }

  let screen;
</script>

<main use:init>
  <Toast />
  {#if screen == SCREENS.TITLE}
    <Title />
  {:else if screen == SCREENS.MAP}
    <Map />
  {:else if screen == SCREENS.MENU}
    <Menu />
  {:else if screen == SCREENS.ENC}
    <Enc />
  {/if}
</main>

<style>
  :global(.view) {
    height: 360px;
    width: 360px;
  }

  :global(.ctrls) {
    margin-top: 20px;
  }

  :global(.ctrls button) {
    width: 85px;
    padding: 10px;
    margin: 10px;
    border-radius: 25px;
  }
</style>
