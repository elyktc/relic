<script>
  import * as util from "../util/util";
  import * as map from "../util/map";
  import { message } from "../util/hermes";
  import MapControls from "../lib/MapControls.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let mapHtml = "";

  const ENCFREQ = 10;

  function init(node) {
    drawMap(map.newMap());
  }

  function icon(s) {
    return `<span class="icon map-${s}"></span>`;
  }

  function drawMap(m) {
    mapHtml = m.map((r) => r.map(icon).join("")).join("<br/>");
  }

  function move(p) {
    if (map.move(p)) {
      drawMap(map.miniMap());
      let t = map.location().terrain;
      if (t != map.CITY && util.rand(getEncFreq()) == 1) {
        //message(dispatch, "Encounter!", 500);
        //initiateEnc();
      }
    }
  }

  function getEncFreq() {
    return map.location().terrain == map.FOREST
      ? Math.ceil(ENCFREQ / 2)
      : ENCFREQ;
  }
</script>

<div use:init>{@html mapHtml}</div>
<MapControls on:move={(e) => move(e.detail)} />

<style>
  div {
    font-family: "Courier New", Courier, monospace;
    background-color: lightgreen;
    word-break: keep-all;
    overflow: hidden;
    border-radius: 20px;
    border: 1px solid white;
    width:360px;
  }
</style>
