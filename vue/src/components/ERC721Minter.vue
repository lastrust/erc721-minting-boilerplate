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
const customStore = async (name, description, data, type, base64) => {
  var formData = new FormData();
  formData.append("image", new File([data], { type }));
  formData.append(
    "meta",
    JSON.stringify({
      name,
      description,
      base64: base64,
    })
  );
  const response = await fetch("https://api.nft.storage/store/", {
    headers: {
      authorization: `Bearer ${process.env.VUE_APP_NFT_STORAGE_KEY}`,
    },
    body: formData,
    method: "POST",
  });
  const result = await response.json();

  if (result.ok === true) {
    const { value } = result;
    return value;
  } else {
    throw new Error(result.error.message);
  }
};

export default {
  name: "ERC721Minter",
  data() {
    return {
      name: "",
      description: "",
      type: null,
      blob: null,
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
          const metadata = await customStore(
            this.name,
            this.description,
            this.blob,
            this.type,
            this.base64
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
