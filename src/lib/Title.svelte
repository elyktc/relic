<script>
  import { showMapScreen, screenFade } from "../modules/screens";
  import user, { init as userInit } from "../modules/user";

  function init(node) {
    userInit();
    node.focus();
  }
</script>

<div transition:screenFade>
  <div class="view col">
    <h1 style:margin-right="50px">Relic</h1>
    <p style:margin-left="100px">by elyktc</p>
    <div class="row">
      <input bind:value={$user.name} maxlength="8" style:display="none" />
    </div>
  </div>
  <div class="ctrls">
    <button use:init on:click={showMapScreen}>Start</button>
  </div>
</div>

<style>
  input {
    font-size: 28px;
    height: 50px;
    width: 150px;
    padding-left: 15px;
  }
</style>
