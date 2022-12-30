<script>
  import {
    screenFade,
    showMapScreen,
    showSleepScreen,
  } from "../modules/screens";
  import map from "../modules/map";
  import user from "../modules/user";
  import { getCity } from "../modules/cities";
  import toast from "../modules/toast";
  import { onMount } from "svelte";

  function handleKeydown(e) {
    switch (e.key) {
      case "q":
        showMapScreen();
        break;
      case "r":
        rest();
        break;
    }
  }

  function rest() {
    if ($user.gp >= city.innCost) {
      $user.gp -= city.innCost;
      showSleepScreen();
    } else {
      toast.show("Not enough gold");
    }
  }

  onMount(() => {
    let loc = map.location().abs;
    city = getCity(loc.x, loc.y);
    //toast.show(`City of ${city.name}`);
  });

  let city;
</script>

<div transition:screenFade>
  <div class="view col">
    {#if city}
      <p>Inn</p>
      <p>{city.innCost} gold per night</p>
    {/if}
  </div>
  <div class="ctrls">
    <button on:click={rest}>Rest</button>
    <button on:click={showMapScreen}>Leave</button>
  </div>
</div>
<svelte:window on:keydown={handleKeydown} />

<style>
</style>
