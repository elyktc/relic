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

  function userOut(node) {
    return userKO ? blur(node, blurOptions) : fly(node, userFlyOptions);
  }

  function encOut(node) {
    return encKO ? blur(node, blurOptions) : undefined;
  }

  let userKO, encKO;
  $: userKO = $user.hp <= 0;
  $: encKO = $enc.hp <= 0;
</script>

<div class="row">
  <div class="col user img">
    {#if !userKO}
      <span
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
  <div class="col enc img">
    {#if !encKO}
      <span
        class="icon dragon"
        class:rejoice={userKO}
        in:fly={encFlyOptions}
        out:encOut
      />
    {:else}
      <div />
    {/if}
  </div>
</div>

<style>
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
