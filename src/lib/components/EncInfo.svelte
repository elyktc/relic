<script>
  import user from "../../modules/user";
  import enc from "../../modules/enc";
  import { HP_METER_DURATION } from "../../modules/constants";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  const hpMeter = tweened(0, {
    duration: HP_METER_DURATION,
    easing: cubicOut,
  });

  const encHpMeter = tweened(0, {
    duration: HP_METER_DURATION,
    easing: cubicOut,
  });

  $: if ($user.hp) hpMeter.set($user.hp / $user.hpbase);
  $: if ($enc.hp) encHpMeter.set($enc.hp / $enc.hpbase);
</script>

<div class="row info">
  <div class="col user">
    {#if !$user.ko() && !$user.fleeing()}
      <progress value={$hpMeter} out:fade={{ duration: 100 }} />
      <span class="lvl">Level {$user.lvl}</span>
    {:else}
      <div />
    {/if}
  </div>
  <div class="col enc">
    {#if !$enc.ko() && !$enc.fleeing()}
      <progress value={$encHpMeter} out:fade={{ duration: 100 }} />
      <span class="lvl">Level {$enc.lvl}</span>
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

  .lvl {
    font-size: 16px;
  }
</style>
