import React, { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  List,
  SkeletonLoader,
  Table,
} from '@nypl/design-system-react-components';

import { LibraryData } from './RegistryAdmin';
import LibraryDetails from './LibraryDetails';

interface LibrariesListProps {
  isSimpleList: boolean;
  libraries: LibraryData[];
}

const LibrariesList = ({ isSimpleList, libraries }: LibrariesListProps) => {
  // isLoading is a flag used to render the SkeletonLoader while the app tries to
  // refresh the accessToken.
  const [isLoadingLibraries, setIsLoadingLibraries] = useState<boolean>(true);
  // Currently renders a list of mock library data.
  const returnListData = useCallback(() => {
    const listData: string[][] = [];
    libraries.map((library) => {
      const { name, number_of_patrons } = library.basic_info;
      const libraryNameandCount = [name, number_of_patrons];
      listData.push(libraryNameandCount);
    });

    return listData;
  }, [libraries]);

  useEffect(() => {
    if (libraries.length) {
      setIsLoadingLibraries(false);
    } else {
      setIsLoadingLibraries(true);
    }
  }, [libraries.length]);

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
          {libraries.map((library: LibraryData) => {
            const { name } = library.basic_info;
            const { registry_stage: registryStage } = library.stages;
            return (
              <li key={name}>
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
