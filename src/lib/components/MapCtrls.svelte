<script>
  import { showMenuScreen } from "../../modules/screens";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const moveNW = () => dispatch("move", { x: -1, y: -1 });
  const moveN = () => dispatch("move", { x: -1, y: 0 });
  const moveNE = () => dispatch("move", { x: -1, y: 1 });
  const moveW = () => dispatch("move", { x: 0, y: -1 });
  const moveE = () => dispatch("move", { x: 0, y: 1 });
  const moveSW = () => dispatch("move", { x: 1, y: -1 });
  const moveS = () => dispatch("move", { x: 1, y: 0 });
  const moveSE = () => dispatch("move", { x: 1, y: 1 });

  function handleKeydown(e) {
    switch (e.key) {
      case "x":
        showMenuScreen();
        break;
      case "q":
        moveNW();
        break;
      case "w":
        moveN();
        break;
      case "e":
        moveNE();
        break;
      case "a":
        moveW();
        break;
      case "d":
        moveE();
        break;
      case "z":
        moveSW();
        break;
      case "s":
        moveS();
        break;
      case "c":
        moveSE();
        break;
    }
  }
</script>

<div class="ctrls">
  <div class="row">
    <button on:click={moveNW}>NW</button>
    <button on:click={moveN}>N</button>
    <button on:click={moveNE}>NE</button>
  </div>
  <div class="row">
    <button on:click={moveW}>W</button>
    <button on:click={showMenuScreen}>Menu</button>
    <button on:click={moveE}>E</button>
  </div>
  <div class="row">
    <button on:click={moveSW}>SW</button>
    <button on:click={moveS}>S</button>
    <button on:click={moveSE}>SE</button>
  </div>
</div>
<svelte:window on:keydown={handleKeydown} />

<style>
</style>
