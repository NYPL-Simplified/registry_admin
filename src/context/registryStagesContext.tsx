import React, { createContext, Dispatch, useState } from 'react';
import { LibraryStage } from '../components/LibraryDetails';

export type RegistryStagesContextValues = {
  registryStages: Record<string, LibraryStage>;
  setRegistryStages: Dispatch<
    React.SetStateAction<Record<string, LibraryStage>>
  >;
};

type RegistryStagesProviderProps = {
  children: React.ReactNode;
};

export const RegistryStagesContext =
  createContext<RegistryStagesContextValues | null>(null);

export const RegistryStagesProvider = ({
  children,
}: RegistryStagesProviderProps) => {
  const [registryStages, setRegistryStages] = useState<
    Record<string, LibraryStage>
  >({});

  console.log('registryStages -->', registryStages);

  return (
    <RegistryStagesContext.Provider
      value={{ registryStages, setRegistryStages }}
    >
      {children}
    </RegistryStagesContext.Provider>
  );
};
