<script>
  import { screenFade, showCityScreen } from "../modules/screens";
  import user from "../modules/user";
  import { wait } from "../modules/util";
  import { onMount } from "svelte";

  onMount(() => {
    $user.hp = $user.hpbase;
    wait(2000, showCityScreen);
  });
</script>

<div transition:screenFade>
  <div class="view">
    <div class="icon moon" style:margin-top="80px" />
  </div>
</div>

<style>
</style>
