<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function setProgress() {
    progress += step;
    if (percentage >= 100) {
      clearInterval(interval);
      dispatch("ready");
    }
  }

  export function start(t) {
    if (interval) {
      clearInterval(interval);
    }
    duration = t;
    progress = 0;
    interval = setInterval(setProgress, step);
  }

  export function cancel() {
    progress = duration;
  }

  let duration = 1000;
  let progress;
  let percentage;
  let interval;

  $: percentage = (progress / duration) * 100;
  $: deg = percentage * 3.6;

  const step = 100;
</script>

<div class="progress-bar" class:hidden={percentage >= 100}>
  <div class="wrapper wrapper1">
    <div class="circle" style:transform={`rotate(${Math.min(deg, 180)}deg)`} />
  </div>
  <div class="wrapper wrapper2">
    <div
      class="circle"
      class:hidden={percentage <= 50}
      style:transform={`rotate(${deg}deg)`}
    />
  </div>
</div>

<style>
  :root {
    --size: 20px;
  }

  .progress-bar {
    width: var(--size, 20px);
    height: var(--size, 20px);
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
    width: var(--size, 20px);
    height: var(--size, 20px);
    box-sizing: border-box;
    border: 2px solid white;
    border-radius: calc(var(--size, 20px) / 2);
    position: absolute;
  }

  .wrapper1 {
    clip: rect(
      0px,
      var(--size, 20px),
      var(--size, 20px),
      calc(var(--size, 20px) / 2)
    );
    /* clip-path: inset(0px 0px 0px 10px); */
  }

  .wrapper1 > .circle {
    clip: rect(0px, calc(var(--size, 20px) / 2), var(--size, 20px), 0px);
    /* clip-path: inset(0px 0px 0px 10px); */
    transform: rotate(0deg);
  }

  .wrapper2 {
    clip: rect(0px, calc(var(--size, 20px) / 2), var(--size, 20px), 0px);
    /* clip-path: inset(0px 0px 0px 10px); */
  }

  .wrapper2 > .circle {
    clip: rect(0px, calc(var(--size, 20px) / 2), var(--size, 20px), 0px);
    /* clip-path: inset(0px 0px 0px 10px); */
    transform: rotate(180deg);
  }

  .hidden {
    visibility: hidden;
  }
</style>
