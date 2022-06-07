import React from 'react';
import { Accordion, List } from '@nypl/design-system-react-components';

import libraries from '../../data/libraries';
import LibraryDetails from './LibraryDetails';

interface LibrariesListProps {
  isSimpleList: boolean;
}

const LibrariesList = ({ isSimpleList }: LibrariesListProps) => (
  <List noStyling type='ul'>
    {libraries.map((library) => {
      const { name } = library.basic_info;
      const { registry_stage: registryStage } = library.stages;
      if (isSimpleList) {
        return <li key={name}>{name}</li>;
      } else {
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
      }
    })}
  </List>
);

export default LibrariesList;
