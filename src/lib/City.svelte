<script>
  import Modal from "./components/Modal.svelte";
  import {
    screenFade,
    showMapScreen,
    showSleepScreen,
  } from "../modules/screens";
  import map from "../modules/map";
  import user from "../modules/user";
  import { acquire } from "../modules/inventory";
  import { getCity } from "../modules/cities";
  import toast from "../modules/toast";
  import { onMount } from "svelte";
  import { rand } from "../modules/util";

  function handleKeydown(e) {
    switch (e.key) {
      case "e":
        shop();
        break;
      case "r":
        rest();
        break;
      case "q":
        showMapScreen();
        break;
    }
  }

  function shop() {
    modal.open();
  }

  function buy(item) {
    if (canAfford(item.value)) {
      acquire(item);
    }
  }

  function rest() {
    if (canAfford(city.innCost)) {
      showSleepScreen();
    }
  }

  function canAfford(price) {
    if ($user.gp >= price) {
      $user.gp -= price;
      return true;
    } else {
      toast.show("Not enough gold");
      return false;
    }
  }

  onMount(() => {
    let loc = map.location().abs;
    city = getCity(loc.x, loc.y);
    canRest = rand(12) > 0;
    canShop = city.items?.length;
    //toast.show(`City of ${city.name}`);
  });

  let city;
  let modal;
  let canRest;
  let canShop;
</script>

<div transition:screenFade>
  <div class="view col">
    {#if city}
      <p>Inn</p>
      {#if canRest}
        <p>{city.innCost} gold per night</p>
      {:else}
        <p>No vacancies</p>
      {/if}
    {/if}
  </div>
  <div class="ctrls">
    <div class="row">
      <button disabled={!canRest} on:click={rest}>Rest</button>
      <button disabled={!canShop} on:click={shop}>Shop</button>
    </div>
    <div class="row">
      <button on:click={showMapScreen}>Leave</button>
    </div>
  </div>
</div>
<Modal bind:this={modal}>
  <div class="col modal">
    <div class="header row spaced"><span>Name</span><span>Price</span></div>
    <div class="col items">
      {#if canShop}
        {#each city.items as item}
          <button class="row spaced" on:click={() => buy(item)}>
            <span>{item.name}</span><span>{item.value} gold</span>
          </button>
        {/each}
      {/if}
    </div>
    <div class="gold row">You have {$user.gp} gold</div>
  </div>
</Modal>
<svelte:window on:keydown={handleKeydown} />

<style>
  .modal {
    height: 100%;
    justify-content: space-between;
  }

  .modal .items,
  .modal .header,
  .modal button,
  .modal .gold {
    width: 100%;
  }

  .modal .items {
    height: 100%;
    justify-content: flex-start;
    overflow-y: auto;
  }

  .modal .header,
  .modal button {
    margin: 5px 0;
  }

  .modal .header span {
    font-size: 12px;
    color: slategray;
    padding: 0 2rem;
  }

  .modal .gold {
    justify-content: flex-end;
    margin-top: 1rem;
  }
</style>
