<script>
  import Modal from "./components/Modal.svelte";
  import Inventory from "./components/Inventory.svelte";
  import { use, itemSelection } from "../modules/inventory";
  import {
    showMapScreen,
    screenFade,
    showTitleScreen,
  } from "../modules/screens";
  import map, { steps } from "../modules/map";
  import user, { nextXp } from "../modules/user";
  import { format } from "../modules/util";
  import { onMount } from "svelte";

  function handleKeydown(e) {
    switch (e.key) {
      case "e":
        openInventory();
        break;
      case "q":
        showMapScreen();
        break;
      case "p":
        showTitleScreen();
        break;
    }
  }

  function openInventory() {
    modal.open();
  }

  function useItem(item) {
    if (item) {
      modal.close();
      use(item);
    }
  }

  onMount(() => {
    const unsub_selection = itemSelection.subscribe(useItem);
    return () => {
      unsub_selection();
    };
  });

  let modal;
</script>

<div transition:screenFade>
  <div class="view col">
    <h1 style:display="none">{$user.name}</h1>
    <div class="row">
      <div class="col label">Level</div>
      <div class="col value">
        {$user.lvl}
      </div>
    </div>
    <div class="row">
      <div class="col label">Experience</div>
      <div class="col value">
        {$user.xp}
      </div>
    </div>
    <div class="row">
      <div class="col label">Next level at</div>
      <div class="col value">
        {nextXp()}
      </div>
    </div>
    <div class="row" style:margin-top="20px">
      <div class="col label">Health</div>
      <div class="col value">
        {$user.hp} / {$user.hpbase}
      </div>
    </div>
    <div class="row">
      <div class="col label">Strength</div>
      <div class="col value">
        {$user.str}
      </div>
    </div>
    <div class="row">
      <div class="col label">Dexterity</div>
      <div class="col value">
        {$user.dex}
      </div>
    </div>
    <div class="row" style:margin="10px 0">
      <div class="col label">Gold</div>
      <div class="col value">
        {format($user.gp)}
      </div>
    </div>
    <div class="row">
      <div class="col label">Steps</div>
      <div class="col value">
        {format($steps)}
      </div>
    </div>
    <div class="row">
      <div class="col label">Explored</div>
      <div class="col value">
        {format(map.getExplored())}
      </div>
    </div>
    <div class="row">
      <div class="col label">Distance traveled</div>
      <div class="col value">
        {format(map.location().distance)}
      </div>
    </div>
  </div>
  <div class="ctrls">
    <div class="row">
      <button on:click={openInventory}>Items</button>
    </div>
    <div class="row">
      <button on:click={showTitleScreen} class="danger">Reset</button>
      <button on:click={showMapScreen}>Back</button>
    </div>
  </div>
</div>
<Modal bind:this={modal}><Inventory /></Modal>
<svelte:window on:keydown={handleKeydown} />

<style>
  .view .row {
    justify-content: space-between;
    width: 240px;
  }

  .ctrls .row {
    justify-content: center;
  }

  .label {
    justify-content: flex-start;
  }

  .value {
    justify-content: flex-end;
  }

  .danger {
    background-color: maroon;
    color: white;
  }
</style>
