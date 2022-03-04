<template>
  <div className="wrapper">
    <p className="title">Step1: Mint your NFT with IPFS</p>
    <input placeholder="Token Name" v-model="name" type="text" />
    <input placeholder="Description" v-model="description" type="text" />
    <input type="file" accept="image/*" @change="select" />

    <img v-if="base64" :src="base64" alt="hoge" className="image" />

    <div v-if="onGoing" className="center">Loading...</div>

    <button v-else @click="mint">mint</button>
    <p v-if="tokenId">token ID: {{ tokenId }}</p>
  </div>
</template>

<script>
import { NFTStorage, File } from "nft.storage";

const store = async (name, description, data, fileName, type) => {
  const nftStorage = new NFTStorage({
    token: process.env.VUE_APP_NFT_STORAGE_KEY,
  });

  const metadata = await nftStorage.store({
    name,
    description,
    image: new File([data], fileName, { type }),
  });

  return metadata;
};

export default {
  name: "ERC721Minter",
  data() {
    return {
      name: "",
      description: "",
      type: null,
      blob: null,
      fileName: "",
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
    select: function (e) {
      const file = e.target.files[0];
      console.log(file);
      if (file) {
        this.readAsBlob(file);
        this.readAsBase64(file);
        this.type = file.type;
        this.fileName = file.name;
      }
    },

    readAsBlob: function (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        console.log(reader.result);
        this.blob = reader.result;
      };
    },

    readAsBase64: function (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result);
        this.base64 = reader.result;
      };
    },
    mint: function () {
      const submit = async () => {
        this.onGoing = true;
        try {
          const metadata = await store(
            this.name,
            this.description,
            this.blob,
            this.fileName,
            this.type
          );
          console.log("url", metadata.url);
          const inputUrl = metadata.url.replace(/^ipfs:\/\//, "");
          console.log(inputUrl);
          const tx = await this.contract.safeMint(this.userAddress, inputUrl);
          const receipt = await tx.wait();
          const event = receipt.events[0];
          const _tokenId = event.args[2];
          this.tokenId = _tokenId;
          this.base64 = null;
          window.alert("Succeeded to mint");
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
