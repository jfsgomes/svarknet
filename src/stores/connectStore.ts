import { getStarknet } from "@argent/get-starknet/dist";
import { writable } from "svelte/store";
import walletStore from "./walletStore";

function createConnectStore() {
  const { update, subscribe } = writable({
    loading: true,
    connected: false,
    noExtension: false,
  });

  const starknet = getStarknet();

  function setLoading(loading: boolean) {
    update((store) => ({ ...store, loading }));
  }

  async function connect(showModal = true) {
    setLoading(true);

    const [userWalletContractAddress] = await starknet.enable({
      showModal,
    });

    if (starknet.isConnected) {
      walletStore.initialiseWallet(userWalletContractAddress);
      update((store) => ({ ...store, connected: true }));

      starknet.on("accountsChanged", handleAccountChange);
    }

    setLoading(false);
  }

  function handleAccountChange() {
    window.location.reload();
  }

  async function init() {
    try {
      let preAuth = await starknet.isPreauthorized();

      if (preAuth) {
        connect(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      update((store) => ({ ...store, noExtension: true }));

      setLoading(false);
    }
  }

  return {
    subscribe,
    connect,
    init,
  };
}

const connectStore = createConnectStore();

connectStore.init();

export default connectStore;
