<script>
  import MapCtrls from "./components/MapCtrls.svelte";
  import {
    showEncScreen,
    showCityScreen,
    screenFade,
  } from "../modules/screens";
  import map, { TERRAINS, init as initMap } from "../modules/map";
  import user from "../modules/user";
  import { clearCities } from "../modules/cities";
  import { rand } from "../modules/util";
  import { ENCFREQ } from "../modules/constants";
  import { onMount } from "svelte";

  function drawMap(m) {
    mapHtml = "<div class=\"row\">" + m.map((r) => 
        r.map((c) => `<div class="icon map-${c}"></div>`).join(""))
      .join("</div><div class=\"row\">") +
      "</div>";
  }

  function getEncFreq() {
    let t = map.location().terrain;
    return t == TERRAINS.FOREST ? Math.ceil(ENCFREQ / 2) : ENCFREQ;
  }

  function move(p) {
    if (map.move(p)) {
      $user.steps++;
      drawMap(map.miniMap());
      let t = map.location().terrain;
      if (t == TERRAINS.CITY) {
        showCityScreen();
      } else if (rand(getEncFreq()) == 1) {
        showEncScreen();
      }
    }
  }

  onMount(() => {
    if (!$user.steps) {
      initMap();
      clearCities();
    }
    drawMap(map.miniMap());
  });

  let mapHtml = "";
</script>

<div transition:screenFade>
  <div class="view field">{@html mapHtml}</div>
  <MapCtrls on:move={(e) => move(e.detail)} />
</div>

<style>
  .field {
    font-family: "Courier New", Courier, monospace;
    word-break: keep-all;
    overflow: hidden;
    background-color: var(--color-grass, green);
    border-radius: 20px;
    border: 1px solid white;
  }

.view :global(.icon) {
  width: 40px;
  height: 40px;
  font-size: 40px;
  line-height: 40px;
}
</style>
