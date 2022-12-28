<script>
  import EncImgs from "./components/EncImgs.svelte";
  import EncInfo from "./components/EncInfo.svelte";
  import { rand, vary } from "../modules/util";
  import {
    showMapScreen,
    screenFade,
    showTitleScreen,
  } from "../modules/screens";
  import user from "../modules/user";
  import enc, { init as initEnc } from "../modules/enc";
  import toast from "../modules/toast";
  import { wait } from "../modules/util";
  import { ENC_OUT_DURATION, VARIANCE } from "../modules/constants";

  function fight() {
    showFight = false;
    damageEnc($user.str);
    if ($enc.hp <= 0) {
      victory();
    } else {
      encTurn();
    }
  }

  function encTurn() {
    wait(rand(400, 600), () => {
      damageUser($enc.str);
      if ($user.hp <= 0) {
        gameover();
      } else {
        showFight = true;
      }
    });
  }

  function damageUser(amount) {
    let dmg = vary(amount);
    $user.hp -= dmg;
    toast.show(`${dmg}`, "user");
  }

  function damageEnc(amount) {
    let dmg = vary(amount);
    $enc.hp -= dmg;
    toast.show(`${dmg}`, "enc");
  }

  function victory() {
    wait(ENC_OUT_DURATION, () => {
      toast.persist(`Got ${$enc.gp} gold!`);
      $user.gp += $enc.gp;
      showBack = true;
    });
  }

  function gameover() {
    wait(ENC_OUT_DURATION, () => {
      toast.persist(`Game over`);
      showRestart = true;
    });
  }

  function init(node) {
    initEnc();
    //toast.show(`Encountered a ${$enc.name}!`);
    showFight = false;
    showBack = false;
    showRestart = false;
    wait(500, () => {
      showFight = true;
    });
  }

  let showFight;
  let showBack;
  let showRestart;
  let gp;
</script>

<div transition:screenFade>
  <div class="view field" use:init>
    <div class="row imgs">
      <EncImgs />
    </div>
    <div class="row info">
      <EncInfo />
    </div>
  </div>
  <div class="ctrls">
    {#if showBack}
      <button on:click={showMapScreen}>Continue</button>
    {:else if showFight}
      <button on:click={fight}>Fight</button>
    {:else if showRestart}
      <button on:click={showTitleScreen}>Reset</button>
    {/if}
  </div>
</div>

<style>
  .field {
    background-color: lightgreen;
    border-radius: 20px;
    border: 1px solid white;
    color: #242424;
    font-size: 24px;
  }

  .imgs,
  .info {
    justify-content: space-between;
  }

  .imgs {
    margin-top: 100px;
  }

  .info {
    font-family: "Averia Libre";
    align-items: flex-start;
    margin-top: 20px;
  }

  :global(.col.user),
  :global(.col.enc) {
    width: 120px;
  }
</style>
