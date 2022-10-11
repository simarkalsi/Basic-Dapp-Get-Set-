import { ethers } from 'ethers';
import React, { useState } from 'react';
import SimpleStore_abi from './SimpleStore_abi.json'


const SimpleStore=()=>{
    const contractAddress="0x9592778c7962182d4bC755dF14397DeE40B52c43"
    const [errorMessage, setErrorMessage] =useState(null);
    const[defaultAccount,setDEfaultAccount]=useState(null);
    const[connButtonText,setConnButtonText]=useState("Connect Wallet");
    const[currentContractVal,setCurrentContractVal]=useState(null);

    const[provider,setProvider]=useState(null);
    const[signer,setSigner]=useState(null);
    const[contract,setContract]=useState(null);


    const connectWalletHandler=()=>{
        if(window.ethereum){
            window.ethereum.request({method:"eth_requestAccounts"})
            .then(result=>{
                accountChangeHandler(result[0]);
                setConnButtonText("WalletConnected");
            })
        }else{
            setErrorMessage("Need to install Metamask")
        }
    }
    const accountChangeHandler=(newAccount)=>{
        setDEfaultAccount(newAccount);
        updateEthers();

    }
    const updateEthers=()=>{
        let tempProvider=new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner=tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract =new ethers.Contract(contractAddress,SimpleStore_abi,tempSigner);
        setContract(tempContract);
    }
    const getCurrentVal=async ()=>{
        let val=await contract.get();
        setCurrentContractVal(val);
    }
    const setHandler=(event)=>{
        event.preventDefault();
        contract.set(event.target.setText.value)

    }

    return(
        <>
        <h3>{"Get/set interaction with contract!"}</h3>
        <button onClick={connectWalletHandler}>{connButtonText}</button>
        <h3>address: {defaultAccount}</h3>

        <form onSubmit={setHandler}>
            <input type="text"  id="setText" /> 
            <button type={"submit"}>Update Contract</button>
        </form>


        <button onClick={getCurrentVal}>Get Current value</button>
        {currentContractVal}
        {errorMessage}
        </>
    )
}

export default SimpleStore;