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
  import enc, { init as initEnc } from "../modules/enc";
  import { getEncSpeed, getUserSpeed, hit } from "..//modules/battle";
  import toast from "../modules/toast";
  import { rand, wait, vary } from "../modules/util";
  import { ENC_OUT_DURATION } from "../modules/constants";

  function handleKeydown(e) {
    switch (e.key) {
      case "f":
        fight();
        break;
      case "q":
        if (!victory && !gameover && !ran) {
          run();
        } else if (victory && canProceed) {
          showMapScreen();
        } else if (gameover && canProceed) {
          showTitleScreen();
        }
        break;
    }
  }

  function fight() {
    if (!canFight) return;
    canFight = false;
    let dmg = hit($user, $enc);
    $enc.hp -= dmg ?? 0;
    toast.show(dmgMsg(dmg), "enc");
    if ($enc.hp <= 0) {
      win();
    } else {
      waiting = true;
      userSpeed = vary(getUserSpeed());
      wait(userSpeed, () => {
        waiting = false;
        if (!victory && !gameover) {
          canFight = true;
        }
      });
    }
  }

  function encTurn() {
    if (!victory && !gameover && !ran) {
      let dmg = hit($enc, $user);
      $user.hp -= dmg ?? 0;
      toast.show(dmgMsg(dmg), "user");
      if ($user.hp <= 0) {
        lose();
      } else {
        wait(vary(encSpeed), encTurn);
      }
    }
  }

  function win() {
    victory = true;
    waiting = false;
    canFight = false;
    wait(ENC_OUT_DURATION, () => {
      canProceed = true;
      $user.gp += $enc.gp;
      toast.persist(`Got ${$enc.gp} gold!`);
    });
  }

  function lose() {
    gameover = true;
    waiting = false;
    canFight = false;
    wait(ENC_OUT_DURATION, () => {
      canProceed = true;
      toast.persist(`Game over`);
    });
  }

  function run() {
    ran = true;
    var drop = rand(Math.min($user.gp / 2, $enc.gp));
    $user.gp -= drop;
    if (drop) toast.show(`Dropped ${drop} gold`);
    wait(1000, showMapScreen);
  }

  function init(node) {
    initEnc();
    //toast.show(`Encountered a ${$enc.name}!`);
    encSpeed = getEncSpeed($enc.dex, $user.dex);
    userSpeed = 0;//rand(getUserSpeed() + 100);
    waiting = true;
    wait(rand(encSpeed) + 100, encTurn);
    wait(userSpeed, () => {
      waiting = false;
      canFight = true;
    });
  }

  const dmgMsg = (dmg) => (dmg == undefined ? "Miss" : `${dmg}`);

  let encSpeed;
  let userSpeed;
  let canFight;
  let canProceed;
  let victory;
  let gameover;
  let ran;
  let waiting;
</script>

<div transition:screenFade>
  <div class="view field" use:init>
    <EncImgs {ran} />
    <EncInfo {ran} />
  </div>
  {#if !ran}
    <div class="ctrls col">
      <div>
        <button disabled={!canFight} on:click={fight}>Fight</button>
        <WaitCircle duration={userSpeed} {waiting} />
      </div>
      {#if !victory && !gameover && !ran}
        <button on:click={run}>Run</button>
      {:else if victory && canProceed}
        <button on:click={showMapScreen}>Carry on</button>
      {:else if gameover && canProceed}
        <button on:click={showTitleScreen}>Reset</button>
      {/if}
    </div>
  {/if}
</div>
<svelte:window on:keydown={handleKeydown} />

<style>
  .field {
    background-color: #64964b;
    border-radius: 20px;
    border: 1px solid white;
    color: #242424;
    font-size: 24px;
  }

  :global(.col.user),
  :global(.col.enc) {
    width: 120px;
  }
</style>
