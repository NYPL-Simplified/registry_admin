import React, { createContext, Dispatch, useState } from 'react';

type TokenContextValues = {
  accessToken: string;
  setAccessToken: Dispatch<React.SetStateAction<string>>;
};

type TokenProviderProps = {
  children: React.ReactNode;
};

export const TokenContext = createContext<TokenContextValues | undefined>(
  undefined
);

export const TokenProvider = ({ children }: TokenProviderProps) => {
  const [accessToken, setAccessToken] = useState<string>('');

  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </TokenContext.Provider>
  );
};

const useTokenContext = () => {
  const context = React.useContext(TokenContext);
  if (typeof context === 'undefined') {
    throw new Error('useLibraries must be used within a LibraryProvider');
  }
  return context;
};

export default useTokenContext;
