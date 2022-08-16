import React, { createContext, Dispatch, useEffect, useState } from 'react';
import { LibraryData } from '../components/RegistryAdmin';

export type LibrariesContextValues = {
  librariesInContext: LibraryData[];
  setLibrariesInContext: Dispatch<React.SetStateAction<LibraryData[]>>;
  setUpdatedLibrary: Dispatch<React.SetStateAction<LibraryData | undefined>>;
};

type LibrariesProviderProps = {
  children: React.ReactNode;
};

export const LibrariesContext = createContext<LibrariesContextValues | null>(
  null
);

export const LibrariesProvider = ({ children }: LibrariesProviderProps) => {
  const [updatedLibrary, setUpdatedLibrary] = useState<
    LibraryData | undefined
  >();
  const [librariesInContext, setLibrariesInContext] = useState<LibraryData[]>(
    []
  );

  useEffect(() => {
    if (updatedLibrary) {
      // Find the index of the library with the same uuid as the one
      // that was recently updated.
      const indexOfElementToReplace = librariesInContext.findIndex(
        (library) => library.uuid === updatedLibrary.uuid
      );

      // Replace the library at that index with the updatedLibrary.
      const updatedLibrariesInContext = librariesInContext.slice();
      updatedLibrariesInContext.splice(
        indexOfElementToReplace,
        1,
        updatedLibrary
      );

      // Set librariesInContext to the updated list.
      setLibrariesInContext(updatedLibrariesInContext);
    }
  }, [updatedLibrary]);

  return (
    <LibrariesContext.Provider
      value={{ librariesInContext, setLibrariesInContext, setUpdatedLibrary }}
    >
      {children}
    </LibrariesContext.Provider>
  );
};
