import {Web3Context} from "../contexts/web3";
import { useEffect, useState } from "react";
import {ethers, Contract} from "ethers";
import { Web3Provider as Provider } from '@ethersproject/providers';
import {CHAIN_INFO} from "../../utils/constant";
import ERC721URIStrorageABI from "../../abis/ERC721URIStorage.json"

export const Web3Provider = ({
    children
}) => {
    const [userAddress, setUserAddress] = useState('')
    const [provider, setProvider] = useState(new ethers.providers.Web3Provider(window.ethereum));
    const [nftContract, setNFTContract] = useState(new Contract(CHAIN_INFO.contracts.ERC721URIStorage, ERC721URIStrorageABI, provider));


    useEffect(async () => {
        await connectMetamask();
    }, [])

    const connectMetamask = async () => {
        if(!window.ethereum) {
            console.log("please install MetaMask")
            return
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const accounts = await provider.send("eth_requestAccounts", []);
        if(accounts.length > 0) setUserAddress(accounts[0]);
        const signer = provider.getSigner();
        const contract = new Contract(CHAIN_INFO.contracts.ERC721URIStorage, ERC721URIStrorageABI, signer);
        setNFTContract(contract);
    }

    const getTokenURI = async (tokenID) => {
        return await nftContract.tokenURI(tokenID);
    }

    const mintNFT = async (address, url) => {
        return await nftContract.safeMint(address, url);
    }

    return (
        <Web3Context.Provider
            value={{
                userAddress,
                connectMetamask,
                getTokenURI,
                mintNFT
            }}
        >
            {children}
        </Web3Context.Provider>
    )
}