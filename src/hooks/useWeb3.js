import {useContext} from "react";
import {Web3Context} from "../components/contexts/web3";

const useWeb3 = () => {
    const context = useContext(Web3Context)
    if (context === undefined) {
        throw new Error('useWeb3 must be used within an WalletProvider')
    }
    return context
}

export default useWeb3