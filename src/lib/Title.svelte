<script>
  import { showMapScreen, screenFade } from "../modules/screens";
  import user, { init as initUser } from "../modules/user";

  function handleKeydown(e) {
    switch (e.key) {
      case " ":
        showMapScreen();
        break;
    }
  }

  function init(node) {
    initUser();
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
<svelte:window on:keydown={handleKeydown} />

<style>
  .view {
    font-family: "Lato", Helvetica, Arial, sans-serif;
  }

  h1 {
    text-shadow: 1px 2px 10px teal;
  }

  input {
    font-size: 28px;
    height: 50px;
    width: 150px;
    padding-left: 15px;
  }
</style>
