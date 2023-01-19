import { useEffect, useState } from "react";

import { ERC721Minter } from "./components/ERC721Minter";
import { ERC721Checker } from "./components/ERC721Checker";
import bunzz from "bunzz-sdk";
import {Web3Provider} from "./components/providers/web3Provider";

const App = () => {

  useEffect(() => {
  }, [])

  return (
    <Web3Provider>
      <div className="center">
        <div>
          <ERC721Minter  />
          <ERC721Checker />
        </div>
      </div>
    </Web3Provider>
  );
};

export default App;
