import {createContext} from "react";

export const Web3Context = createContext({
    userAddress: undefined,
    connectMetamask: () => undefined,
    getTokenURI: () => undefined,
    mintNFT: () => undefined,
})