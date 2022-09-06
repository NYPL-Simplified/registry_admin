import React, { createContext, Dispatch, useEffect, useState } from 'react';
import { LibraryData } from '../components/RegistryAdmin';

type LibrariesContextValues = {
  libraries: LibraryData[];
  setLibraries: Dispatch<React.SetStateAction<LibraryData[]>>;
  setUpdatedLibrary: Dispatch<React.SetStateAction<LibraryData | undefined>>;
};

type LibrariesProviderProps = {
  children: React.ReactNode;
};

export const LibrariesContext = createContext<
  LibrariesContextValues | undefined
>(undefined);

export const LibrariesProvider = ({ children }: LibrariesProviderProps) => {
  const [updatedLibrary, setUpdatedLibrary] = useState<
    LibraryData | undefined
  >();
  const [libraries, setLibraries] = useState<LibraryData[]>([]);

  useEffect(() => {
    if (updatedLibrary) {
      // Find the index of the library with the same uuid as the one
      // that was recently updated.
      const indexOfElementToReplace = libraries.findIndex(
        (library) => library.uuid === updatedLibrary.uuid
      );

      // Replace the library at that index with the updatedLibrary.
      const updatedLibraries = libraries.slice();
      updatedLibraries.splice(indexOfElementToReplace, 1, updatedLibrary);

      // Set libraries to the updated list.
      setLibraries(updatedLibraries);
    }
  }, [updatedLibrary]);

  return (
    <LibrariesContext.Provider
      value={{ libraries, setLibraries, setUpdatedLibrary }}
    >
      {children}
    </LibrariesContext.Provider>
  );
};

const useLibrariesContext = () => {
  const context = React.useContext(LibrariesContext);
  if (typeof context === 'undefined') {
    throw new Error('useLibraries must be used within a LibraryProvider');
  }
  return context;
};

export default useLibrariesContext;
