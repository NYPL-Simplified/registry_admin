import React from 'react';
import { Accordion, List, Table } from '@nypl/design-system-react-components';

import libraries from '../../data/libraries';
import LibraryDetails from './LibraryDetails';

interface LibrariesListProps {
  isSimpleList: boolean;
}

const LibrariesList = ({ isSimpleList }: LibrariesListProps) => {
  // Currently renders a list of mock library data.
  const returnListData = () => {
    const listData: string[][] = [];
    libraries.map((library) => {
      const { name, number_of_patrons } = library.basic_info;
      const libraryNameandCount = [name, number_of_patrons];
      listData.push(libraryNameandCount);
    });
    return listData;
  };

  return (
    <>
      {isSimpleList ? (
        <Table
          columnHeaders={['Library Name', 'Patron Count']}
          columnHeadersBackgroundColor='section.blogs.primary'
          tableData={returnListData()}
        />
      ) : (
        <List noStyling type='ul'>
          {libraries.map((library) => {
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
