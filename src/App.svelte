<script>
  import Map from "./lib/Map.svelte";

  let message = "";

  function showMessage(m) {
    message = m.message ?? "";
    if (m.timeout) {
      setTimeout(() => {
        message = "";
      }, m.timeout);
    }
  }
</script>

<main>
  <div class="col">
    <div class="message row" style:visibility={message ? "visible" : "hidden"}>
      {message}
    </div>
    <Map on:message={(e) => showMessage(e.detail)} />
  </div>
</main>

<style>
  :root {
    user-select: none;
  }
  .row,
  .col {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .col {
    flex-direction: column;
  }
  .message {
    margin: 15px 0;
    width: 100%;
    border: 2px solid white;
    border-radius: 10px;
    height: 60px;
    font-size: 24px;
    background-color: darkblue;
  }
</style>
