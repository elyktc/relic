<script>
  import EncImgs from "./components/EncImgs.svelte";
  import EncInfo from "./components/EncInfo.svelte";
  import WaitCircle from "./components/WaitCircle.svelte";
  import {
    showMapScreen,
    screenFade,
    showTitleScreen,
  } from "../modules/screens";
  import user, { levelUp, nextXp } from "../modules/user";
  import enc, { init as initEnc } from "../modules/enc";
  import {
    getEncSpeed,
    getUserSpeed,
    userHit,
    encHit,
    encMisses,
  } from "../modules/battle";
  import toast from "../modules/toast";
  import { rand, wait, vary } from "../modules/util";
  import { ENC_OUT_DURATION } from "../modules/constants";
  import { onMount } from "svelte";

  function handleKeydown(e) {
    switch (e.key) {
      case "f":
        fight();
        break;
      case "v":
        block();
        break;
      case "q":
        if (engaged) {
          userFlee();
        } else if (victory && canProceed) {
          showMapScreen();
        } else if (gameover && canProceed) {
          showTitleScreen();
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
      canFight = true;
    }
  }

  function fight() {
    if (!canFight) {
      return;
    }
    canFight = false;
    $user.status.blocking = false;
    userHit();
    setTimeout(userWait, 1);
  }

  function block() {
    if (!canFight) {
      return;
    }
    canFight = false;
    $user.block();
    userWait();
  }

  function userFlee() {
    waitSign.cancel();
    $user.flee();
    var drop = rand(Math.min($user.gp / 2, $enc.gp));
    $user.gp -= drop;
    if (drop) {
      toast.show(`Dropped ${drop} gold`);
    }
    wait(1000, showMapScreen);
  }

  function encTurn() {
    if (engaged) {
      encHit();
      encTimeout = wait(vary(encSpeed), encTurn);
    }
  }

  function win() {
    victory = true;
    waitSign.cancel();
    canFight = false;
    wait(ENC_OUT_DURATION, () => {
      canProceed = true;
      loot();
    });
  }

  function lose() {
    gameover = true;
    waitSign.cancel();
    canFight = false;
    wait(ENC_OUT_DURATION, () => {
      canProceed = true;
      toast.persist(`Game over`);
    });
  }

  function loot() {
    let xp = $enc.xp;
    let next = nextXp();
    if ($enc.fleeing()) {
      xp *= 1 - $enc.hp / $enc.maxhp;
      xp = Math.floor(Math.min(xp, next - $user.xp - 1));
    }
    if (xp) {
      $user.xp += xp;
      toast.persist(`Gained ${xp} experience`, "enc");
    }
    if ($user.xp >= next) {
      levelUp();
      toast.persist(`Level up!`, "enc");
    }
    if ($enc.gp && !$enc.fleeing()) {
      $user.gp += $enc.gp;
      toast.persist(`Found ${$enc.gp} gold`, "enc");
    }
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
      encMisses.set(0);
      $user.status.fleeing = false;
      $enc.status.fleeing = false;
      unsub_enc();
      unsub_user();
    };
  });

  let encSpeed;
  let userSpeed;
  let canFight;
  let canProceed;
  let victory;
  let gameover;
  let waitSign;
  let encTimeout;

  $: engaged = !victory && !gameover && !$user.fleeing() && !$enc?.fleeing();
</script>

<div transition:screenFade>
  <div class="view field">
    {#if $enc}
      <EncImgs />
      <EncInfo />
    {/if}
  </div>
  {#if !$user.fleeing()}
    <div class="ctrls col">
      <div>
        <button disabled={!canFight} on:click={fight}>Fight</button>
        <button disabled={!canFight} on:click={block}>Block</button>
        <WaitCircle bind:this={waitSign} on:ready={userTurn} />
      </div>
      {#if engaged}
        <button on:click={userFlee}>Flee</button>
      {:else if victory && canProceed}
        <button on:click={showMapScreen}>Proceed</button>
      {:else if gameover && canProceed}
        <button on:click={showTitleScreen}>Reset</button>
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
