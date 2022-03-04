
<template>
  <div className="center">
    <div>
      <ERC721Minter :contract="contract" :userAddress="userAddress" />
      <ERC721Checker :contract="contract" :userAddress="userAddress" />
    </div>
  </div>
</template>

<script>
import bunzz from "bunzz-sdk";

import ERC721Minter from "./components/ERC721Minter.vue";
import ERC721Checker from "./components/ERC721Checker.vue";

const DAPP_ID = process.env.VUE_APP_DAPP_ID;
const API_KEY = process.env.VUE_APP_API_KEY;

const init = async () => {
  const handler = await bunzz.initializeHandler({
    dappId: DAPP_ID,
    apiKey: API_KEY,
  });
  return handler;
};

export default {
  name: "App",
  components: { ERC721Minter, ERC721Checker },
  data() {
    return {
      userAddress: null,
      contract: null,
      value: 0,
    };
  },
  created: function () {
    const setup = async () => {
      try {
        const handler = await init();
        const userAddress = await handler.getSignerAddress();
        const contract = await handler.getContract("NFT (IPFS Mintable)");

        this.userAddress = userAddress;
        this.contract = contract;
      } catch (error) {
        console.error(error);
      }
    };

    setup();
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

.wrapper {
  display: flex;
  flex-direction: column;
  margin: 30px;
  justify-content: space-evenly;
}

.title {
  font-size: 20px;
  margin-top: 20px;
}

.image {
  width: 200px;
  height: 200px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
