<script>
  import { screenFade, showMapScreen } from "../modules/screens";
  import user from "../modules/user";
  import { wait } from "../modules/util";
  import { onMount } from "svelte";

  onMount(() => {
    $user.hp = $user.maxhp;
    wait(2000, showMapScreen);
  });
</script>

<div transition:screenFade>
  <div class="view">
    <div class="icon moon" style:margin-top="80px" />
  </div>
</div>

<style>
</style>
