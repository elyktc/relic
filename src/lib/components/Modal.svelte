<script>
  import { onDestroy } from "svelte";

  let topDiv;
  let visible = false;

  function keyPress(e) {
    if (e.key == "Escape") {
      close();
    }
  }

  export function open() {
    if (visible) {
      return;
    }
    window.addEventListener("keydown", keyPress);
    document.body.style.overflow = "hidden";
    visible = true;
    document.body.appendChild(topDiv);
  }

  export function close() {
    if (!visible) {
      return;
    }
    window.removeEventListener("keydown", keyPress);
    document.body.style.overflow = "";
    visible = false;
  }

  onDestroy(() => {
    window.removeEventListener("keydown", keyPress);
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="topModal" class:visible bind:this={topDiv} on:click={() => close()}>
  <div id="modal" on:click|stopPropagation={() => {}}>
    <div id="modal-content">
      <slot />
    </div>
  </div>
</div>

<style>
  #topModal {
    visibility: hidden;
    z-index: 9998;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #444444f0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #modal {
    position: relative;
    border-radius: 8px;
    background: var(--color-background);
    filter: drop-shadow(5px 5px 5px #555);
    padding: 1em;
  }

  .visible {
    visibility: visible !important;
  }

  #modal-content {
    width: 250px;
    height: 350px;
    overflow: auto;
  }
</style>
