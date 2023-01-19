const NETWORK_LIST = {
    goerli: {
        chainName: "Goerli Testnet",
        chainIdHex: "0x5",
        chainId: 5,
        RPC: "https://goerli.infura.io/v3/" + process.env.REACT_APP_INFURA_KEY,
        contracts: {
            ERC721URIStorage: "0xDb9df908751f8b20d0fc786a6E6F70b1d718628A"
        }
    }
}

export const CHAIN_INFO = NETWORK_LIST[process.env.REACT_APP_NETWORK];