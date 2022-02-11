<template>
  <div className="wrapper">
    <p className="title">Step2: Get your NFT</p>
    <input placeholder="token ID" v-model="tokenId" type="text" />
    <div v-if="onGoing" className="center">Loading...</div>
    <button v-else @click="get">get</button
    ><img v-if="base64" :src="base64" alt="hoge" className="image" />
    <p v-if="name">Name: {{ name }}</p>
    <p v-if="description">Description: {{ description }}</p>
  </div>
</template>

<script>
export default {
  name: "ERC721Checker",
  data() {
    return {
      name: "",
      description: "",
      base64: null,
      onGoing: false,
      tokenId: null,
    };
  },
  props: {
    contract: Object,
    userAddress: String,
  },
  methods: {
    get: function () {
      const submit = async () => {
        this.onGoing = true;
        try {
          console.log(this.contract, this.tokenId);
          const { data: tokenUri } = await this.contract.tokenURI(this.tokenId);
          const url = tokenUri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
          const res = await fetch(url);
          const data = await res.json();
          this.base64 = data.base64;
          this.name = data.name;
          this.description = data.description;
        } catch (err) {
          console.error(err);
        } finally {
          this.onGoing = false;
        }
      };
      submit();
    },
  },
};
</script>