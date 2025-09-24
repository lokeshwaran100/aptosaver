import React, { createContext, useState, useContext, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { checkAndCreateUser } from "@/lib/utils";

interface UserContextType {
  user: any | undefined;
  setUser: React.Dispatch<React.SetStateAction<any | undefined>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | undefined>(undefined);
  const { account, connected } = useWallet();

  useEffect(() => {
    if (!account?.address) {
      setUser(undefined);
    }
    if (connected && account?.address) {
      checkAndCreateUser(account.address, setUser);
    }
  }, [connected, account?.address]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};