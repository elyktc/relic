<script>
  import Toast from "./Toast.svelte";
  import user from "../../modules/user";
  import enc from "../../modules/enc";
  import { BLUR_DURATION, FLY_DURATION } from "../../modules/constants";
  import { fly, blur } from "svelte/transition";

  const userFlyOptions = {
    x: 40,
    duration: FLY_DURATION,
  };

  const encFlyOptions = {
    x: -40,
    duration: FLY_DURATION,
  };

  const blurOptions = {
    amount: 40,
    duration: BLUR_DURATION,
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
    return out(node, $enc.ko(), $user.ko(), userFlyOptions);
  }

  function encOut(node) {
    return out(
      node,
      $user.ko(),
      $enc.ko(),
      encFlyOptions,
      $user.ko() || $user.fleeing()
    );
  }
</script>

<div class="row imgs">
  <div class="row">
    <div class="col user img">
      {#if !$user.ko() && !$user.fleeing()}
        <div
          class="icon map-u"
          class:rejoice={$enc.ko()}
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
    {#if !$enc.ko() && !$enc.fleeing()}
      <div class="col enc img">
        <div
          class="icon dragon"
          class:rejoice={$user.ko()}
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
