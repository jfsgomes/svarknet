<script lang="ts">
  import walletStore from "../stores/walletStore";

  let address = $walletStore.userAddress.substring(0, 10);
</script>

<div class="my-10">
  <h1 class="text-3xl">Hello there, {address}</h1>

  {#if $walletStore.balance !== null}
    <p>Balance: <strong>{$walletStore.balance} tokens</strong></p>
  {/if}
</div>
