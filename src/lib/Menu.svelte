<script>
  import { showMapScreen, screenFade, showTitleScreen } from "../modules/screens";
  import map from "../modules/map";
  import user from "../modules/user";
</script>

<div transition:screenFade>
  <div class="view col">
    <h1 style:display="none">{$user.name}</h1>
    <div class="row">
      <div class="col label">Health</div>
      <div class="col value">
        {$user.hp} / {$user.maxhp}
      </div>
    </div>
    <div class="row">
      <div class="col label">Strength</div>
      <div class="col value">
        {$user.str}
      </div>
    </div>
    <div class="row">
      <div class="col label">Gold</div>
      <div class="col value">
        {$user.gp}
      </div>
    </div>
    <div class="row">
      <div class="col label">Steps</div>
      <div class="col value">
        {new Intl.NumberFormat().format($user.steps)}
      </div>
    </div>
    <div class="row">
      <div class="col label">Explored</div>
      <div class="col value">
        {new Intl.NumberFormat().format(map.getExplored())}
      </div>
    </div>
  </div>
  <div class="ctrls">
    <button on:click={showTitleScreen} style:background-color="maroon">Reset</button>
    <button on:click={showMapScreen}>Back</button>
  </div>
</div>

<style>
  .view {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .row {
    justify-content: space-between;
    width: 240px;
  }

  .label {
    justify-content: flex-start;
  }

  .value {
    justify-content: flex-end;
  }
</style>
