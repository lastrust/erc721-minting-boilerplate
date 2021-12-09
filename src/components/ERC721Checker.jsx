import { useState } from "react";

export const ERC721Checker = ({ bunzz, userAddress }) => {
  const [base64, setBase64] = useState(null);
  const [tokenId, setTokenId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [onGoing, setOnGoing] = useState(false);

  const submit = async () => {
    setOnGoing(true);
    try {
      const contract = await bunzz.getContract("NFT (IPFS Mintable)");
      const { response: tokenUri } = await contract.tokenURI(tokenId);
      const url = tokenUri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
      const res = await fetch(url);
      const data = await res.json();
      setBase64(data.base64);
      setName(data.name);
      setDescription(data.description);
    } catch (err) {
      console.error(err);
    } finally {
      setOnGoing(false);
    }
  };

  return (
    <div className="wrapper">
      <p className="title">
        Step2: Get your NFT
      </p>
      <input
        placeholder="token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        type="text"
      />
      {onGoing ? (
        <div className="center">
          Loading...
        </div>
      ) : (
        <button onClick={submit}>
          get
        </button>
      )}
      {base64 ? (
          <img src={base64} alt="hoge" className="image" />
      ) : (
        <></>
      )}
      {name ? <p>Name: {name}</p> : <></>}
      {description ? <p>Description: {description}</p> : <></>}
    </div>
  );
};
