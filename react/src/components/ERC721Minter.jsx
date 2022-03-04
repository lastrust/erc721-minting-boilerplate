import { useState } from "react";
import { NFTStorage, File } from "nft.storage";

const nftStorage = new NFTStorage({
  token: process.env.REACT_APP_NFT_STORAGE_KEY,
});

const store = async (name, description, data, fileName, type) => {
  const metadata = await nftStorage.store({
    name,
    description,
    image: new File([data], fileName, { type }),
  });
  console.log(metadata);
  return metadata;
};

export const ERC721Minter = ({ bunzz, userAddress }) => {
  const [blob, setBlob] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [base64, setBase64] = useState(null);
  const [onGoing, setOnGoing] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [type, setType] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const select = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      readAsBlob(file);
      readAsBase64(file);
      setType(file.type);
      setFileName(file.name);
    }
  };

  const readAsBlob = (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      console.log(reader.result);
      setBlob(reader.result);
    };
  };

  const readAsBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      setBase64(reader.result);
    };
  };

  const submit = async () => {
    setOnGoing(true);
    try {
      const metadata = await store(name, description, blob, fileName, type);
      const contract = await bunzz.getContract("NFT (IPFS Mintable)");
      const inputUrl = metadata.url.replace(/^ipfs:\/\//, "");

      const tx = await contract.safeMint(userAddress, inputUrl);
      const receipt = await tx.wait();
      console.log(receipt);

      const event = receipt.events[0];
      const _tokenId = event.args[2];
      setTokenId(_tokenId);
      setBase64(null);
      window.alert("Succeeded to mint");
    } catch (err) {
      console.error(err);
    } finally {
      setOnGoing(false);
    }
  };

  return (
    <div className="wrapper">
      <p className="title">
        Step1: Mint your NFT with IPFS
      </p>
      <input
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
      />
      <input type="file" accept="image/*" onChange={select} />
      {base64 ? (
          <img src={base64} alt="hoge" className="image" />
      ) : (
        <></>
      )}
      {onGoing ? (
        <div className="center">
          Loading...
        </div>
      ) : (
        <button onClick={submit}>
          mint
        </button>
      )}
      {tokenId ? <p>token ID: {tokenId}</p> : <></>}
    </div>
  );
};
