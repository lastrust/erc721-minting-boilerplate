import { useState } from "react";

export const ERC721Checker = ({ bunzz, userAddress }) => {
  const [tokenId, setTokenId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [onGoing, setOnGoing] = useState(false);

  const submit = async () => {
    setOnGoing(true);
    try {
      const contract = await bunzz.getContract("NFT (IPFS Mintable)");
      const { data: tokenUri } = await contract.tokenURI(tokenId);
      const url = tokenUri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
      const res = await fetch(url);
      const data = await res.json();
      setName(data.name);
      setDescription(data.description);
      setImage(data.image.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/"));
    } catch (err) {
      console.error(err);
    } finally {
      setOnGoing(false);
    }
  };

  return (
    <div className="wrapper">
      <p className="title">Step2: Get your NFT</p>
      <input
        placeholder="token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        type="text"
      />
      {onGoing ? (
        <div className="center">Loading...</div>
      ) : (
        <button onClick={submit}>get</button>
      )}
      {name ? <p>Name: {name}</p> : <></>}
      {description ? <p>Description: {description}</p> : <></>}
      {image ? <img src={image} alt="image" className="image" /> : <></>}
    </div>
  );
};
