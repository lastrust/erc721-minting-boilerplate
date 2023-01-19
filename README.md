# ERC721 Minting Boilerplate

By cloning this repository, you can instantly create a mint application of ERC721 minting.

## Getting Started

### 1. Clone

```bash
$ git clone https://github.com/lastrust/erc721-minting-boilerplate.git
$ cd erc721-minting-boilerplate
```

### 2. Create your DApp with Bunzz

Please access to [Bunzz](https://app.bunzz.dev).

For this application, you need to deploy "NFT (IPFS Mitable)" smart contract at a minimum.

### 3. Configure environment

- Create NFT Storage

NFT Storage is free storage for NFT.
Please access to [this page](https://nft.storage/) and login.

You can get your API key from **API Keys** page.
<img width="1440" alt="スクリーンショット 2021-12-09 14 52 36" src="https://user-images.githubusercontent.com/53442928/145342198-536d75b5-cb11-4736-8748-5b8ad8fd2063.png">

Let's add `REACT_APP_NFT_STORAGE_KEY` to `.env` file.
```
REACT_APP_NFT_STORAGE_KEY=YOUR_NFT_STORAGE_KEY
```

- Add INFURA_KEY

Let's add `REACT_APP_INFURA_KEY` to `.env` file.
```
REACT_APP_INFURA_KEY=YOUR_INFURA_KEY
```

You can refer this guide: [How to get infura key](https://ethereumico.io/knowledge-base/infura-api-key-guide/)

- Add Network name

Let's add `REACT_APP_NETWORK`

If you deployed the contract on goerli network, add this.
```
REACT_APP_NETWORK=goerli
```

*** Don't share the private keys on github ***

### 4. Update constant.js

Open `utils/constant.js` file.

Add this in NETWORK_LIST

```
goerli: {
    chainName: "Goerli Testnet",
    chainIdHex: "0x5",
    chainId: 5,
    RPC: "https://goerli.infura.io/v3/" + process.env.REACT_APP_INFURA_KEY,
    contracts: {
        ERC721URIStorage: ""
    }
}
```

Set ERC721URIStorage with the contract address you deployed.

*** Need to share deployed smart contract address with users on github. ***

### 5. Start application

```bash
$ yarn install
$ yarn start
```

### 6. Try to use application

This is the screen for minting the NFT.
<img width="1440" alt="スクリーンショット 2021-12-14 10 51 20" src="https://user-images.githubusercontent.com/53442928/145918300-695353d0-88f7-40f5-a182-69b37142098a.png">

Now let's mint the NFT. Enter the "Token Name", "description" and "image" in Step 1. </br>
When you are done, press the "mint" button.

Minting creates an NFT on the blockchain.
This application stores NFT metadata in IPFS.

Then let's fetch the NFT you created. Below the mint button, you can see the ID. Please enter this ID to form in Step2 and press the "get" button.

You can see the NFT you created.
<img width="1440" alt="スクリーンショット 2021-12-14 11 18 29" src="https://user-images.githubusercontent.com/53442928/145921034-45e8c10a-9fb4-40c4-b279-51ac69431fdc.png">