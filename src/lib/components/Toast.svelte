<script>
  import { SvelteToast } from "@zerodevx/svelte-toast";

  const options1 = {
    duration: 1000, // duration of progress bar tween to the `next` value
    initial: 1, // initial progress bar value
    next: 0, // next progress value
    pausable: true, // pause progress bar tween on mouse hover
    dismissable: false, // allow dismiss with close button
    reversed: false, // insert new toast to bottom of stack
    intro: { x: 0 }, // toast intro fly animation settings
    theme: {}, // css var overrides
    classes: [], // user-defined classes
  };

  const options2 = {
    duration: 500, // duration of progress bar tween to the `next` value
    initial: 1, // initial progress bar value
    next: 0, // next progress value
    pausable: false, // pause progress bar tween on mouse hover
    dismissable: false, // allow dismiss with close button
    reversed: true, // insert new toast to bottom of stack
    intro: { y: 20, duration: 100 }, // toast intro fly animation settings
    theme: {}, // css var overrides
    classes: [], // user-defined classes
  };

  let options;
  function init(node) {
    if (type == 1) {
      options = options1;
    } else if (type == 2) {
      options = options2;
    }
  }

  export let type = 1;
  export let target = undefined;
</script>

<div class={`toast-wrapper-${type}`} use:init>
  <SvelteToast {options} {target} />
</div>

<style>
  .toast-wrapper-1 {
    font-family: "Lato", Helvetica, Arial, sans-serif;
    font-size: 20px;
    position: relative;
    display: flex;
    justify-content: center;
    --toastBorderRadius: 10px;
    --toastBorder: 2px solid white;
    --toastBarBackground: transparent;
    --toastColor: white;
    --toastBackground: darkblue;
    --toastWidth: 300px;
  }

  .toast-wrapper-1 :global(._toastContainer) {
    position: absolute;
    top: 1rem;
    right: auto;
  }

  .toast-wrapper-2 {
    font-size: 18px;
    font-family: "Averia Libre";
    text-shadow: black 2px 0 8px;
    --toastContainerTop: 0;
    --toastContainerRight: 0;
    --toastContainerBottom: auto;
    --toastContainerLeft: 0;
    --toastWidth: 100%;
    --toastMinHeight: 2rem;
    --toastPadding: 0;
    --toastColor: white;
    --toastBarBackground: transparent;
    --toastBackground: transparent;
    --toastBoxShadow: none;
    --toastBtnWidth: 0;
  }

  .toast-wrapper-2 :global(._toastContainer) {
    position: relative;
    top: 0;
    right: 0;
  }
</style>
