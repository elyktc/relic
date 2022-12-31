<script>
  import Toast from "./Toast.svelte";
  import user from "../../modules/user";
  import enc from "../../modules/enc";
  import { ENC_OUT_DURATION } from "../../modules/constants";
  import { fly, blur } from "svelte/transition";

  const userFlyOptions = {
    x: 40,
    duration: 200,
  };

  const encFlyOptions = {
    x: -40,
    duration: 200,
  };

  const blurOptions = {
    amount: 40,
    duration: ENC_OUT_DURATION,
  };

  function out(node, won, lost, flyOptions, prevent) {
    if (prevent) {
      return;
    }
    if (lost) {
      return blur(node, blurOptions);
    } else {
      let options = flyOptions;
      if (!won) {
        options.x *= -1;
      }
      return fly(node, options);
    }
  }

  function userOut(node) {
    return out(node, encKO, userKO, userFlyOptions);
  }

  function encOut(node) {
    return out(node, userKO, encKO, encFlyOptions, userKO || userRan);
  }

  let userKO, encKO;
  $: userKO = $user.hp <= 0;
  $: encKO = $enc.hp <= 0;

  export let userRan;
  export let encRan;
</script>

<div class="row imgs">
  <div class="row">
    <div class="col user img">
      {#if !userKO && !userRan}
        <div
          class="icon map-u"
          class:rejoice={encKO}
          in:fly={userFlyOptions}
          out:userOut
        />
      {:else}
        <div />
      {/if}
    </div>
    <div class="col toast">
      <Toast target="user" type={2} />
    </div>
  </div>
  <div class="row">
    <div class="col toast">
      <Toast target="enc" type={2} />
    </div>
    {#if !encKO && !encRan}
      <div class="col enc img">
        <div
          class="icon dragon"
          class:rejoice={userKO}
          in:fly={encFlyOptions}
          out:encOut
        />
      </div>
    {/if}
  </div>
</div>

<style>
  .imgs {
    justify-content: space-between;
    margin-top: 100px;
  }

  .img {
    height: 120px;
    justify-content: flex-end;
  }

  .icon {
    font-size: 80px;
    padding: 20px;
  }

  .enc .rejoice {
    animation: spin 0.2s ease-in-out infinite alternate;
  }

  .user .rejoice {
    animation: jump 0.2s ease-out infinite alternate;
  }

  @keyframes shake {
    to {
      transform: translateX(5px);
    }
  }

  @keyframes jump {
    to {
      transform: translateY(-10px);
    }
  }

  @keyframes spin {
    to {
      transform: scaleX(-1);
    }
  }
</style>
