<script>
  import { items, itemSelection } from "../../modules/inventory";
  import { get } from "svelte/store";
</script>

<div class="col">
  <div class="header"><span>Name</span><span>Quantity</span></div>
  {#each get(items) as item}
    <button on:click={() => itemSelection.set(item.name)}>
      <span>{item.name}</span><span>{item.qty}</span>
    </button>
  {/each}
</div>

<style>
  .header,
  button {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 5px 0;
  }

  .header span {
    font-size: 12px;
    color: slategray;
    padding: 0 2rem;
  }
</style>
