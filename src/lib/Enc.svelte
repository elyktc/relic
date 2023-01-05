<script>
  import EncImgs from "./components/EncImgs.svelte";
  import EncInfo from "./components/EncInfo.svelte";
  import WaitCircle from "./components/WaitCircle.svelte";
  import {
    showMapScreen,
    screenFade,
    showTitleScreen,
  } from "../modules/screens";
  import user, { levelUp } from "../modules/user";
  import enc, { init as initEnc } from "../modules/enc";
  import { getEncSpeed, getUserSpeed, hit } from "..//modules/battle";
  import toast from "../modules/toast";
  import { rand, wait, vary } from "../modules/util";
  import { ENC_OUT_DURATION } from "../modules/constants";
  import { onMount } from "svelte";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  const userRan = writable(false);
  const encRan = writable(false);

  setContext("userRan", userRan);
  setContext("encRan", encRan);

  function handleKeydown(e) {
    switch (e.key) {
      case "f":
        fight();
        break;
      case "v":
        block();
        break;
      case "q":
        if (!victory && !gameover && !$userRan && !$encRan) {
          userRun();
        } else if (victory && canProceed) {
          showMapScreen();
        } else if (gameover && canProceed) {
          showTitleScreen();
        }
        break;
    }
  }

  function userWait() {
    userSpeed = vary(getUserSpeed());
    waitSign.start(userSpeed);
  }

  function userTurn() {
    if (!victory && !gameover) {
      canFight = true;
    }
  }

  function fight() {
    if (!canFight) {
      return;
    }
    canFight = false;
    blocking = false;
    let dmg = hit($user, $enc);
    $enc.hp -= dmg ?? 0;
    toast.show(dmgMsg(dmg), "enc");
    if ($enc.ko()) {
      win();
    } else {
      userWait();
    }
  }

  function block() {
    if (!canFight) {
      return;
    }
    blocking = true;
    canFight = false;
    userWait();
  }

  function userRun() {
    waitSign.cancel();
    $userRan = true;
    var drop = rand(Math.min($user.gp / 2, $enc.gp));
    $user.gp -= drop;
    if (drop) {
      toast.show(`Dropped ${drop} gold`);
    }
    wait(1000, showMapScreen);
  }

  function encTurn() {
    if (!victory && !gameover && !$userRan && !exited) {
      let dmg = hit($enc, $user);
      if (dmg && blocking) {
        dmg = Math.ceil(dmg / 4);
      }
      $user.hp -= dmg ?? 0;
      toast.show(dmgMsg(dmg), "user");
      if (!dmg) {
        encMisses++;
      } else {
        encMisses = 0;
      }
      if ($user.ko()) {
        lose();
      } else {
        if (encMisses > 3 && rand(1) == 1) {
          wait(500, encRun);
        } else {
          wait(vary(encSpeed), encTurn);
        }
      }
    }
  }

  function encRun() {
    $encRan = true;
    toast.show("Escaped");
    win();
  }

  function win() {
    waitSign.cancel();
    victory = true;
    canFight = false;
    wait(ENC_OUT_DURATION, () => {
      canProceed = true;
      loot();
    });
  }

  function lose() {
    waitSign.cancel();
    gameover = true;
    canFight = false;
    wait(ENC_OUT_DURATION, () => {
      canProceed = true;
      toast.persist(`Game over`);
    });
  }

  function loot() {
    let xp = $enc.xp;
    if ($encRan) {
      xp *= 1 - $enc.hp / $enc.maxhp;
      xp = Math.floor(Math.min(xp, $user.next - $user.xp - 1));
    }
    if (xp) {
      $user.xp += xp;
      toast.persist(`Gained ${xp} experience`, "enc");
    }
    if ($user.xp >= $user.next) {
      levelUp($user);
      toast.persist(`Level up!`, "enc");
    }
    if ($enc.gp && !$encRan) {
      $user.gp += $enc.gp;
      toast.persist(`Found ${$enc.gp} gold`, "enc");
    }
  }

  onMount(() => {
    initEnc();
    //toast.show(`Encountered a ${$enc.name}!`);
    encSpeed = getEncSpeed($enc.dex, $user.dex);
    userSpeed = getUserSpeed();
    wait(rand(encSpeed), encTurn);
    waitSign.start(userSpeed);
    return () => {
      waitSign?.cancel();
      exited = true;
    };
  });

  const dmgMsg = (dmg) => (dmg == undefined ? "Miss" : `${dmg}`);

  let encSpeed;
  let userSpeed;
  let canFight;
  let canProceed;
  let victory;
  let gameover;
  let blocking;
  let exited;
  let waitSign;
  let encMisses = 0;
</script>

<div transition:screenFade>
  <div class="view field">
    <EncImgs />
    <EncInfo />
  </div>
  {#if !$userRan}
    <div class="ctrls col">
      <div>
        <button disabled={!canFight} on:click={fight}>Fight</button>
        <button disabled={!canFight} on:click={block}>Block</button>
        <WaitCircle bind:this={waitSign} on:ready={userTurn} />
      </div>
      {#if !victory && !gameover && !$userRan && !$encRan}
        <button on:click={userRun}>Run</button>
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
