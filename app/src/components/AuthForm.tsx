"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export const AuthForm = ({ isLogin }: { isLogin: boolean }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<"credentials" | "wallet">("credentials");
  const [petraAddress, setPetraAddress] = useState("");

  const { connect, disconnect, account, connected } = useWallet();

  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      window.open("https://petra.app/", `_blank`);
    }
  };

  const wallet = getAptosWallet();

  const connectPetra = async () => {
    //@ts-ignore
    if (typeof window !== "undefined" && window.aptos) {
      try {
        //@ts-ignore
        const response = await wallet.connect();
        console.log("Petra wallet connected, address:", response.address); // Add this line
        setPetraAddress(response.address);
        console.log(response);
        localStorage.setItem("petraAddress", response.address);
      } catch (error) {
        console.error("Failed to connect to Petra wallet:", error);
      }
    } else {
      window.open("https://petra.app/", "_blank");
    }
  };

  const disconnectPetra = async () => {
    //@ts-ignore
    await wallet.disconnect();
    setPetraAddress("");
    localStorage.removeItem("petraAddress");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (loginMethod === "wallet") {
        console.log("Login with wallet", { walletAddress: account?.address });
      } else {
        console.log("Login with credentials", { username, password });
      }
    } else {
      if (connected && username && password) {
        console.log("Sign Up", { username, password, walletAddress: account?.address });
      } else {
        console.log("Please fill all fields and connect wallet for signup");
      }
    }
  };

  useEffect(() => {
    const storedAddress = localStorage.getItem("petraAddress");
    if (storedAddress) {
      setPetraAddress(storedAddress);
    }
  }, []);

  console.log("Current petraAddress:", petraAddress); // Add this line just before the return statement

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isLogin && (
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setLoginMethod("credentials")}
            className={`flex-1 py-2 px-4 rounded-lg ${loginMethod === "credentials" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Username & Password
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod("wallet")}
            className={`flex-1 py-2 px-4 rounded-lg ${loginMethod === "wallet" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Wallet
          </button>
        </div>
      )}

      {(!isLogin || (isLogin && loginMethod === "credentials")) && (
        <>
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </>
      )}

      {(!isLogin || (isLogin && loginMethod === "wallet")) && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={petraAddress ? disconnectPetra : connectPetra}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 overflow-hidden text-ellipsis"
          >
            {petraAddress
              ? `Connected: ${petraAddress.slice(0, 6)}...${petraAddress.slice(-4)}`
              : "Connect Petra Wallet"}
          </button>
          {petraAddress && (
            <button
              type="button"
              onClick={disconnectPetra}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Disconnect Wallet
            </button>
          )}
        </div>
      )}

      {/* {petraAddress && (
        <div className="text-sm text-gray-300 bg-gray-800 p-2 rounded-lg">
          Connected Address: {petraAddress.slice(0, 6)}...{petraAddress.slice(-4)}
        </div>
      )} */}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition duration-300"
        disabled={!isLogin && (!connected || !username || !password)}
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>
    </form>
  );
};
