<script>
  import { showMapScreen, screenFade } from "../modules/screens";
  import { init as initUser } from "../modules/user";
  import { steps } from "../modules/map";
  import { onMount } from "svelte";

  function handleKeydown(e) {
    switch (e.key) {
      case " ":
        showMapScreen();
        break;
    }
  }

  onMount(() => {
    initUser();
    $steps = 0;
  });
</script>

<div transition:screenFade>
  <div class="view col">
    <h1 style:margin-right="50px">Relic</h1>
    <p style:margin-left="100px">by elyktc</p>
  </div>
  <div class="ctrls">
    <button on:click={showMapScreen}>Start</button>
  </div>
</div>
<svelte:window on:keydown={handleKeydown} />

<style>
  .view {
    font-family: "Lato", Helvetica, Arial, sans-serif;
  }

  h1 {
    text-shadow: 1px 2px 10px teal;
  }
</style>
