<script>
  import EncImgs from "./components/EncImgs.svelte";
  import EncInfo from "./components/EncInfo.svelte";
  import WaitCircle from "./components/WaitCircle.svelte";
  import {
    showMapScreen,
    screenFade,
    showTitleScreen,
  } from "../modules/screens";
  import user from "../modules/user";
  import enc, { init as initEnc, act as encAct } from "../modules/enc";
  import {
    getEncSpeed,
    getUserSpeed,
    userStrike,
    userEvade,
    userFlee,
    loot,
  } from "../modules/battle";
  import toast from "../modules/toast";
  import { rand, wait, vary } from "../modules/util";
  import { BLUR_DURATION, FLY_DURATION } from "../modules/constants";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  function handleKeydown(e) {
    switch (e.key) {
      case "f":
        strike();
        break;
      case "v":
        evade();
        break;
      case "q":
        if (engaged) {
          flee();
        } else if (victory && canProceed) {
          proceed();
        } else if (gameover && canProceed) {
          reset();
        }
        break;
    }
  }

  function userWait() {
    if (engaged) {
      userSpeed = vary(getUserSpeed());
      waitSign.start(userSpeed);
    }
  }

  function userTurn() {
    if (engaged) {
      canAct = true;
    }
  }

  function strike() {
    if (!canAct) {
      return;
    }
    canAct = false;
    userStrike();
    setTimeout(userWait, 1);
  }

  function evade() {
    if (!canAct) {
      return;
    }
    canAct = false;
    userEvade();
    setTimeout(userWait, 1);
  }

  function flee() {
    waitSign.cancel();
    userFlee();
    wait(1000, showMapScreen);
  }

  function encTurn() {
    if (engaged) {
      get(encAct)();
      encTimeout = wait(vary(encSpeed), encTurn);
    }
  }

  function win() {
    victory = true;
    waitSign.cancel();
    canAct = false;
    wait(BLUR_DURATION, () => {
      loot();
      canProceed = true;
    });
  }

  function lose() {
    gameover = true;
    waitSign.cancel();
    canAct = false;
    wait(BLUR_DURATION, () => {
      toast.persist(`Game over`);
      canProceed = true;
    });
  }

  function proceed() {
    proceeding = true;
    wait(FLY_DURATION, showMapScreen);
  }

  function reset() {
    showTitleScreen();
  }

  onMount(() => {
    initEnc();
    //toast.show(`Encountered a ${$enc.name}!`);
    encSpeed = getEncSpeed($enc.dex, $user.dex);
    userSpeed = getUserSpeed();

    const unsub_user = user.subscribe((u) => {
      if (u?.ko()) {
        lose();
      }
    });

    const unsub_enc = enc.subscribe((e) => {
      if (e?.ko() || e?.fleeing()) {
        win();
      }
    });

    encTimeout = wait(rand(encSpeed), encTurn);
    waitSign.start(userSpeed);

    return () => {
      waitSign?.cancel();
      clearTimeout(encTimeout);
      unsub_enc();
      unsub_user();
      $user.status.fleeing = false;
      $enc = null;
    };
  });

  let encSpeed;
  let userSpeed;
  let canAct;
  let canProceed;
  let proceeding;
  let victory;
  let gameover;
  let waitSign;
  let encTimeout;

  $: engaged = !victory && !gameover && !$user.fleeing() && !$enc?.fleeing();
</script>

<div transition:screenFade>
  <div class="view field">
    {#if $enc && !proceeding}
      <EncImgs />
      <EncInfo />
    {/if}
  </div>
  {#if !$user.fleeing()}
    <div class="ctrls col">
      <div>
        <button disabled={!canAct} on:click={strike}>Strike</button>
        <button disabled={!canAct} on:click={evade}>Evade</button>
        <WaitCircle bind:this={waitSign} on:ready={userTurn} />
      </div>
      {#if engaged}
        <button on:click={flee}>Flee</button>
      {:else if victory && canProceed}
        <button on:click={proceed}>Proceed</button>
      {:else if gameover && canProceed}
        <button on:click={reset}>Reset</button>
      {/if}
    </div>
  {/if}
</div>
<svelte:window on:keydown={handleKeydown} />

<style>
  .field {
    background-color: var(--color-grass, green);
    border-radius: 20px;
    border: 1px solid white;
    color: var(--color-background, black);
    font-size: 24px;
    margin: 0 10px;
  }

  :global(.col.user),
  :global(.col.enc) {
    width: 120px;
  }
</style>
