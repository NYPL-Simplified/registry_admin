import React, { createContext, Dispatch, useState } from 'react';

export type TokenContextValues = {
  accessToken: string;
  setAccessToken: Dispatch<React.SetStateAction<string>>;
};

type TokenProviderProps = {
  children: React.ReactNode;
};

export const TokenContext = createContext<TokenContextValues | null>(null);

export const TokenProvider = ({ children }: TokenProviderProps) => {
  const [accessToken, setAccessToken] = useState<string>('');

  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </TokenContext.Provider>
  );
};
