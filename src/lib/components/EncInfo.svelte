<script>
  import user from "../../modules/user";
  import enc from "../../modules/enc";
  import { HP_METER_DURATION } from "../../modules/constants";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  const hpMeter = tweened(0, {
    duration: HP_METER_DURATION,
    easing: cubicOut,
  });

  const encHpMeter = tweened(0, {
    duration: HP_METER_DURATION,
    easing: cubicOut,
  });

  $: if ($user.hp) hpMeter.set($user.hp / $user.maxhp);
  $: if ($enc.hp) encHpMeter.set($enc.hp / $enc.maxhp);

  export let userRan;
  export let encRan;
</script>

<div class="row info">
  <div class="col user">
    {#if $user.hp > 0 && !userRan}
      <progress value={$hpMeter} />
    {:else}
      <div />
    {/if}
  </div>
  <div class="col enc">
    {#if $enc.hp > 0 && !encRan}
      <progress value={$encHpMeter} />
    {:else}
      <div />
    {/if}
  </div>
</div>

<style>
  progress {
    display: block;
    width: 50%;
    height: 15px;
    accent-color: firebrick;
  }

  .info {
    justify-content: space-between;
    font-family: "Averia Libre";
    align-items: flex-start;
    margin-top: 20px;
  }
</style>
