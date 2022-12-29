<script>
  import {
    screenFade,
    showMapScreen,
    showBlankScreen,
  } from "../modules/screens";
  import map from "../modules/map";
  import user from "../modules/user";
  import { getCity } from "../modules/cities";
  import toast from "../modules/toast";

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
      $user.hp = $user.maxhp;
      showBlankScreen(2000, showMapScreen);
    } else {
      toast.show("Not enough gold");
    }
  }

  function init(node) {
    let loc = map.location().abs;
    city = getCity(loc.x, loc.y);
    //toast.show(`City of ${city.name}`);
  }

  let city;
</script>

<div transition:screenFade>
  <div class="view col" use:init>
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
