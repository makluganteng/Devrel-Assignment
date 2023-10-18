import Image from "next/image";
import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import ABI from "../../public/nft.json";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [token, setToken] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");

  //allow to get the address of the current connected wallet
  const { address } = useAccount();

  //This is a react hook that allows to read a contract based on the contract address given and the ABI taht match the contract
  const { data } = useContractRead({
    address: "0x7cb9f7fFDe47abbeF7A905151951fEF561a2f644", //contact address
    abi: ABI, //ABI of the contract
    functionName: "name", //function name
    args: [], //arguments of the function
  });

  //This is the function to handle the click to read
  const handleRead = () => {
    console.log(data);
    setToken(data as string);
  };

  //This is a react hook that allows to prepare a write statement on a contract based on the contract address given and the ABI taht match the contract
  const { config } = usePrepareContractWrite({
    address: "0x7cb9f7fFDe47abbeF7A905151951fEF561a2f644", //contact address
    abi: ABI, //ABI of the contract
    functionName: "safeMint", //function name
    args: [walletAddress], //arguments of the function
  });

  //This is a react hook that allows to write on a contract based on the contract address given and the ABI taht match the contract
  const { data: data2, isSuccess, isLoading, write } = useContractWrite(config);

  //This is the function to handle the click to write
  const handleWrite = () => {
    if (write) write();
  };

  useEffect(() => {
    setWalletAddress(address as string);
  }, []);

  return (
    <div>
      <div>
        <ConnectButton />
      </div>
      <div>
        <button onClick={handleRead}>Read Contract</button>
      </div>
      <div>{token ? <p>{token}</p> : <p></p>}</div>
      <div>
        <button onClick={handleWrite}>Write Contract</button>
      </div>
      <div>
        {isLoading ? <p>Loading...</p> : isSuccess ? <p>Success!</p> : <p></p>}
      </div>
    </div>
  );
}
