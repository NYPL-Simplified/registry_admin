import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from 'react';
export interface LibraryData {
  areas: {
    focus: string[];
    service: string[];
  };
  basic_info: {
    description: string;
    internal_urn: string;
    name: string;
    number_of_patrons: string;
    online_registration: string;
    pls_id: string;
    short_name: string;
    timestamp: string;
  };
  stages: {
    library_stage: 'testing' | 'production' | 'cancelled';
    registry_stage: 'testing' | 'production' | 'cancelled';
  };
  urls_and_contact: {
    authentication_url: string;
    contact_email: string | null;
    contact_validated: string;
    copyright_email: string | null;
    copyright_validated: string;
    help_email: string | null;
    help_validated: string;
    opds_url: string;
    web_url: string;
  };
  uuid: string;
}

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
  const context = useContext(LibrariesContext);
  if (typeof context === 'undefined') {
    throw new Error('useLibraries must be used within a LibraryProvider');
  }
  return context;
};

export default useLibrariesContext;
