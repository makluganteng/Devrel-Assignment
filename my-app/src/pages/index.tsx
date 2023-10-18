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

  const { address } = useAccount();
  const { data } = useContractRead({
    address: "0x7cb9f7fFDe47abbeF7A905151951fEF561a2f644",
    abi: ABI,
    functionName: "name",
    args: [],
  });

  const handleRead = () => {
    console.log(data);
    setToken(data as string);
  };

  const { config } = usePrepareContractWrite({
    address: "0x7cb9f7fFDe47abbeF7A905151951fEF561a2f644",
    abi: ABI,
    functionName: "safeMint",
    args: [walletAddress],
  });

  const { data: data2, isSuccess, isLoading, write } = useContractWrite(config);

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
