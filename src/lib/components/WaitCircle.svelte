<script>
  function setProgress() {
    progress += step;
    if (percentage >= 100) {
      clearInterval(interval);
    }
  }

  function init(node) {
    progress = 0;
    interval = setInterval(setProgress, step);
  }

  let progress;
  let percentage;
  let interval;

  $: percentage = (progress / duration) * 100;
  $: deg = percentage * 3.6;

  const step = 100;

  export let duration = 1000;
  export let waiting = false;
</script>

{#if waiting}
  <div class="progress-bar" class:hidden={percentage >= 100} use:init>
    <div class="wrapper wrapper1">
      <div
        class="circle"
        style:transform={`rotate(${Math.min(deg, 180)}deg)`}
      />
    </div>
    <div class="wrapper wrapper2">
      <div
        class="circle"
        class:hidden={percentage <= 50}
        style:transform={`rotate(${deg}deg)`}
      />
    </div>
  </div>
{/if}

<style>
  :root {
    --size: 20px;
  }

  .progress-bar {
    width: var(--size);
    height: var(--size);
    position: relative;
    display: inline;
  }

  .wrapper {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }

  .circle {
    width: var(--size);
    height: var(--size);
    box-sizing: border-box;
    border: 2px solid white;
    border-radius: calc(var(--size) / 2);
    position: absolute;
  }

  .wrapper1 {
    clip: rect(0px, var(--size), var(--size), calc(var(--size) / 2));
    /* clip-path: inset(0px 0px 0px 10px); */
  }

  .wrapper1 > .circle {
    clip: rect(0px, calc(var(--size) / 2), var(--size), 0px);
    /* clip-path: inset(0px 0px 0px 10px); */
    transform: rotate(0deg);
  }

  .wrapper2 {
    clip: rect(0px, calc(var(--size) / 2), var(--size), 0px);
    /* clip-path: inset(0px 0px 0px 10px); */
  }

  .wrapper2 > .circle {
    clip: rect(0px, calc(var(--size) / 2), var(--size), 0px);
    /* clip-path: inset(0px 0px 0px 10px); */
    transform: rotate(180deg);
  }

  .hidden {
    visibility: hidden;
  }
</style>
