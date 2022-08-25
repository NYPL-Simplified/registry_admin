import React, { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  List,
  SkeletonLoader,
  Table,
  Text,
} from '@nypl/design-system-react-components';

import { LibraryData } from './RegistryAdmin';
import LibraryDetails from './LibraryDetails';

interface LibrariesListProps {
  error: string;
  isSimpleList: boolean;
  libraries: LibraryData[];
}

const LibrariesList = ({
  error,
  isSimpleList,
  libraries,
}: LibrariesListProps) => {
  // isLoading is a flag used to render the SkeletonLoader while the app tries to
  // refresh the accessToken.
  const [isLoadingLibraries, setIsLoadingLibraries] = useState<boolean>(true);

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
    // Once we have libraries, the SkeletonLoader should no longer display.
    if (libraries.length) {
      setIsLoadingLibraries(false);
    } else {
      setIsLoadingLibraries(true);
    }
  }, [libraries.length]);

  // If there's an error, the SkeletonLoader should not be displayed.
  useEffect(() => {
    if (error) {
      setIsLoadingLibraries(false);
    }
  }, [error]);

  return (
    <>
      {error ? (
        <Text __css={{ color: 'ui.error.primary' }}>{error}</Text>
      ) : isLoadingLibraries ? (
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
