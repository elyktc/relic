<script>
  import { items, itemSelection } from "../../modules/inventory";
  import { onMount } from "svelte";

  let inventory;

  onMount(() => {
    const unsub_inventory = items.subscribe((i) => (inventory = i));
    return () => {
      unsub_inventory();
    };
  });
</script>

<div class="col">
  {#if inventory?.length}
    <div class="header row spaced"><span>Name</span><span>Quantity</span></div>
    {#each inventory as item}
      <button class="row spaced" on:click={() => itemSelection.set(item)}>
        <span>{item.name}</span><span>{item.qty}</span>
      </button>
    {/each}
  {:else}
    <p>You have nothing</p>
  {/if}
</div>

<style>
  .header,
  button {
    width: 100%;
    margin: 5px 0;
  }

  .header span {
    font-size: 12px;
    color: slategray;
    padding: 0 2rem;
  }
</style>
