import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Accordion,
  List,
  SkeletonLoader,
  Table,
} from '@nypl/design-system-react-components';

import { LibraryData } from './RegistryAdmin';
import LibraryDetails from './LibraryDetails';
import {
  LibrariesContext,
  LibrariesContextValues,
} from '../context/librariesContext';

interface LibrariesListProps {
  isSimpleList: boolean;
}

const LibrariesList = ({ isSimpleList }: LibrariesListProps) => {
  // isLoading is a flag used to render the SkeletonLoader while the app tries to
  // refresh the accessToken.
  const [isLoadingLibraries, setIsLoadingLibraries] = useState<boolean>(true);

  const { librariesInContext } = useContext(
    LibrariesContext
  ) as LibrariesContextValues;

  const returnListData = useCallback(() => {
    const listData: string[][] = [];
    librariesInContext.map((library) => {
      const { name, number_of_patrons } = library.basic_info;
      const libraryNameandCount = [name, number_of_patrons];
      listData.push(libraryNameandCount);
    });
    return listData;
  }, [librariesInContext]);

  useEffect(() => {
    if (librariesInContext.length) {
      setIsLoadingLibraries(false);
    } else {
      setIsLoadingLibraries(true);
    }
  }, [librariesInContext.length]);

  return (
    <>
      {isLoadingLibraries ? (
        <SkeletonLoader headingSize={20} showImage={false} />
      ) : isSimpleList ? (
        <Table
          columnHeaders={['Library Name', 'Patron Count']}
          columnHeadersBackgroundColor='section.blogs.primary'
          tableData={returnListData()}
        />
      ) : (
        <List noStyling type='ul'>
          {librariesInContext.map((library: LibraryData) => {
            const { name } = library.basic_info;
            const { registry_stage: registryStage } = library.stages;
            return (
              <li key={library.uuid}>
                <Accordion
                  accordionData={[
                    {
                      accordionType:
                        registryStage === 'production'
                          ? 'default'
                          : registryStage === 'testing'
                          ? 'warning'
                          : 'error',
                      label: name,
                      panel: <LibraryDetails library={library} />,
                    },
                  ]}
                  id={name}
                />
              </li>
            );
          })}
        </List>
      )}
    </>
  );
};

export default LibrariesList;
