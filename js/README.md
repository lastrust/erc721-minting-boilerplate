# ERC721 Minting Boilerplate

By cloning this repository, you can instantly create a mint application of ERC721 minting.

## Overview

This application uses the [bunzz-sdk](https://www.npmjs.com/package/bunzz-sdk) to communicate smart contact.

For detailed instructions on how to use bunzz-sdk, see [here](https://www.npmjs.com/package/bunzz-sdk).

## Getting Started

### 1. Clone

```bash
$ git clone <REPO_URL>
$ cd <into the folder>
```

### 2. Create your DApp with Bunzz

Please access to [Bunzz](https://app.bunzz.dev).
And pease refer to [this video]() to create a DApp project and deploy smart contract.

For this application, you need to deploy "NFT (IPFS Mintable)" smart contract at a minimum.

### 3. Get DApp ID and API Key

When you have finished creating your DApp project and deploying smart contract, copy the **API key** and **DApp ID**.

You can get your **API Key** and **DApp ID** from **Client SDK** in sidebar.

And write them in the `env.json` file.

Please replace YOUR_DAPP_ID and YOUR_API_KEY with values that you copied.

```
{
  "JS_DAPP_ID": "YOUR_DAPP_ID",
  "JS_API_KEY": "YOUR_API_KEY",
}
```

### 4. Create NFT Storage

NFT Storage is free storage for NFT.
Please access to [this page](https://nft.storage/) and login.

You can get your API key from **API Keys** page.

Let's add `JS_APP_NFT_STORAGE_KEY` to `env.json` file.

```
...
"JS_APP_NFT_STORAGE_KEY": "YOUR_NFT_STORAGE KEY"
```

### 5. Start application

```bash
$ npm install
$ npm run dev
```

### 6. Try to use application

Now let's mint the NFT. Enter the "Token Name", "description" and "image" in Step 1. </br>
After you finished it, press the "mint" button.

Minting creates an NFT on the blockchain.
This application stores NFT metadata in IPFS.

Then let's fetch the NFT you created. Below the mint button, you can see the ID. Please enter this ID to form in Step2 and press the "get" button.

You can see the NFT you created.
