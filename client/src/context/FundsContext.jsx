import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  ///////// Input Datas
  const [formData1, setformData1] = useState({ address: "", govtype: "", name: ""});
  const [addFundsForm, setAddFundsForm] = useState({ amount: 0});
  const [formData2, setformData2] = useState({ amount:0, to:"", project:""});
  const [formData3, setformData3] = useState({ amount:0, to:"", project:""});

  ///////////////////
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);
  const [govTransactions, setGovTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [spend, setSpend] = useState(0);
  //////////////////////
  const [cLogin, setCLogin] = useState(false);
  const [govLogin, setGovLogin] = useState(false);
  const [govDetails, setGovDetails] = useEffect({address:"", gov_type:"", name:"", balance:0, spend:0});
  const [allocFunds, setAllocFunds] = useEffect([]);
  const [alreadyGov, setAlreadyGov] = useEffect(true);

  const handleChange = (e, name) => {
    setformData1((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleChange2 = (e, name) => {
    setAddFundsForm((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleChange3 = (e, name) => {
    setformData2((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleChange4 = (e, name) => {
    setformData2((prevState) => ({ ...prevState, [name]: e.target.value }));
  };


  ///////// Get All Transactions
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.to,
          addressFrom: transaction.from,
          toName: transaction.to_name,
          fromName: transaction.from_name,
          timestamp: new Date(transaction.time.toNumber() * 1000).toLocaleString(),
          amount: parseInt(transaction.amount),
          project: transaction.project_name
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        // getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

//   const sendTransaction = async () => {
//     try {
//       if (ethereum) {
//         const { addressTo, amount, keyword, message } = formData;
//         const transactionsContract = createEthereumContract();
//         const parsedAmount = ethers.utils.parseEther(amount);

//         await ethereum.request({
//           method: "eth_sendTransaction",
//           params: [{
//             from: currentAccount,
//             to: addressTo,
//             gas: "0x5208",
//             value: parsedAmount._hex,
//           }],
//         });

//         const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

//         setIsLoading(true);
//         console.log(`Loading - ${transactionHash.hash}`);
//         await transactionHash.wait();
//         console.log(`Success - ${transactionHash.hash}`);
//         setIsLoading(false);

//         const transactionsCount = await transactionsContract.getTransactionCount();

//         setTransactionCount(transactionsCount.toNumber());
//         window.location.reload();
//       } else {
//         console.log("No ethereum object");
//       }
//     } catch (error) {
//       console.log(error);

//       throw new Error("No ethereum object");
//     }
//   };

  /////////////////////////////////////////////////////////////////////
  /////// Funds Functions
  /////////////////////////////////////////////////////////////////////
  const centralLogin = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const login = await transactionsContract.CentralLogin();
        console.log(login);
        setCLogin(login);

      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const governmentLogin = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const login = await transactionsContract.GovernmentLogin();
        console.log(login);
        setGovLogin(login);

      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GovernmentDetails = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const details = await transactionsContract.GovernmentDetails();
        console.log(details);
        const det={
            address: details.address,
            gov_type: details.gov_type,
            name: details.name,
            balance: details.name,
            spend: details.spend
        }
        setGovDetails(det);

      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const bal = await transactionsContract.GetBalance();
        console.log(bal);
        setBalance(bal);

      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSpend = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const spe = await transactionsContract.GetSpend();
        console.log(spe);
        setSpend(spe);

      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

    const AddFunds = async () => {
        try {
        if (ethereum) {
            const { amount } = addFundsForm;
            const transactionsContract = createEthereumContract();
            //const parsedAmount = parseInt(amount);

            const transactionHash = await transactionsContract.AddFunds(amount);

            // setIsLoading(true);
            // console.log(`Loading - ${transactionHash.hash}`);
            // await transactionHash.wait();
            // console.log(`Success - ${transactionHash.hash}`);
            // setIsLoading(false);

            const transactionsCount = await transactionsContract.getTransactionCount();

            setTransactionCount(transactionsCount.toNumber());
            window.location.reload();
        } else {
            console.log("No ethereum object");
        }
        } catch (error) {
        console.log(error);

        throw new Error("No ethereum object");
        }
  };

  const getAddedFunds = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const alloc = await transactionsContract.getAllocatedFunds();
        console.log(alloc);
        setAllocFunds(alloc);

      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const CheckRegisterGovernment = async () => {
    try {
    if (ethereum) {
        const { address, gov_type, name } = formData1;
        const transactionsContract = createEthereumContract();

        const checkReg = await transactionsContract.CheckRegister(name);
        setAlreadyGov(checkReg);
    } else {
        console.log("No ethereum object");
    }
    } catch (error) {
    console.log(error);

    throw new Error("No ethereum object");
    }
 };

  const RegisterGovernment = async () => {
    try {
    if (ethereum) {
        const { address, gov_type, name } = formData1;
        const transactionsContract = createEthereumContract();


        const transaction = await transactionsContract.Register(address, gov_type, name);

        //const transaction = await transactionsContract.Register(amount);

        // setIsLoading(true);
        // console.log(`Loading - ${transactionHash.hash}`);
        // await transactionHash.wait();
        // console.log(`Success - ${transactionHash.hash}`);
        // setIsLoading(false);

        window.location.reload();
    } else {
        console.log("No ethereum object");
    }
    } catch (error) {
    console.log(error);

    throw new Error("No ethereum object");
    }
 };

//  const checkRegPlusRegisterGovernment = async () => {
//     try {
//     if (ethereum) {
//         const { address, gov_type, name } = formData1;
//         const transactionsContract = createEthereumContract();
//         const checkReg = await transactionsContract.CheckRegister(name);
//         setAlreadyGov(checkReg);
//         if(checkReg == true){
//             const transaction = await transactionsContract.Register(address, gov_type, name);
//             window.location.reload();
//         }

//     } else {
//         console.log("No ethereum object");
//     }
//     } catch (error) {
//     console.log(error);

//     throw new Error("No ethereum object");
//     }
//  };


    const AllocateFunds = async () => {
        try {
        if (ethereum) {
            const { amount, to, project } = formData2;
            const transactionsContract = createEthereumContract();

            const transactionHash = await transactionsContract.AllocateFunds(amount,to,project);

            const transactionsCount = await transactionsContract.getTransactionCount();

            setTransactionCount(transactionsCount.toNumber());
            window.location.reload();
        } else {
            console.log("No ethereum object");
        }
        } catch (error) {
        console.log(error);

        throw new Error("No ethereum object");
        }
    };

    const TransferFunds = async () => {
        try {
        if (ethereum) {
            const { amount, to, project } = formData3;
            const transactionsContract = createEthereumContract();

            const transactionHash = await transactionsContract.AllocateFunds(amount,to,project);

            const transactionsCount = await transactionsContract.getTransactionCount();

            setTransactionCount(transactionsCount.toNumber());
            window.location.reload();
        } else {
            console.log("No ethereum object");
        }
        } catch (error) {
        console.log(error);

        throw new Error("No ethereum object");
        }
    };

    const getAllGovernmentTrancations = async () => {
        try {
          if (ethereum) {
            const transactionsContract = createEthereumContract();
    
            const availableTransactions = await transactionsContract.getAllGovernmentTrancations();
    
            const structuredTransactions = availableTransactions.map((transaction) => ({
              addressTo: transaction.to,
              addressFrom: transaction.from,
              toName: transaction.to_name,
              fromName: transaction.from_name,
              timestamp: new Date(transaction.time.toNumber() * 1000).toLocaleString(),
              amount: parseInt(transaction.amount),
              project: transaction.project_name
            }));
    
            console.log(structuredTransactions);
    
            setGovTransactions(structuredTransactions);
          } else {
            console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
        }
    };
  


  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        govTransactions,
        currentAccount,
        isLoading,
        /////////
        handleChange,
        handleChange2,
        handleChange3,
        handleChange4,
        /////////
        formData1,
        addFundsForm,
        formData3,
        formData2,
        //////////
        cLogin,
        govLogin,
        govDetails,
        allocFunds,
        balance,
        spend

      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
