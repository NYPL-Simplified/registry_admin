import React, { useContext } from 'react';
import {
  Box,
  Form,
  FormField,
  FormRow,
  Table,
  Tabs,
} from '@nypl/design-system-react-components';

import LibraryDetailsGrid from './LibraryDetailsGrid';
import StageSelect from './StageSelect';
import { LibraryData } from './RegistryAdmin';
import { TokenContext, TokenContextValues } from '../context/tokenContext';
import { UPDATE_LIBRARY_STAGE } from '../constants';
import {
  LibrariesContext,
  LibrariesContextValues,
} from '../context/librariesContext';

interface LibraryDetailsProps {
  library: LibraryData;
}

export type LibraryStage = 'testing' | 'production' | 'cancelled' | '';

const LibraryDetails = ({ library }: LibraryDetailsProps) => {
  const {
    uuid,
    basic_info: basicInfo,
    urls_and_contact: urlsAndContact,
    areas,
    stages,
  } = library;

  const { accessToken } = useContext(TokenContext) as TokenContextValues;
  const { setUpdatedLibrary } = useContext(
    LibrariesContext
  ) as LibrariesContextValues;

  const getEmailData = () => {
    const emailData = [];
    for (const key in urlsAndContact) {
      if (key.split('_')[1] === 'email') {
        emailData.push([
          key.split('_').join(' '),
          urlsAndContact[key as keyof typeof urlsAndContact] ||
            'None available',
        ]);
      }
    }

    return emailData;
  };

  const libraryTabsData = [
    {
      label: 'Basic Information',
      content: <LibraryDetailsGrid content={basicInfo} />,
    },
    {
      label: 'Contact & URLs',
      content: <LibraryDetailsGrid content={urlsAndContact} />,
    },
    {
      label: 'Areas',
      content: <LibraryDetailsGrid content={areas} />,
    },
  ];

  const fetchUpdatedLibrary = () => {
    fetch(`${process.env.REGISTRY_API_DOMAIN}/libraries/${uuid}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('There was an issue fetching the updated library.');
        }
      })
      .then((response) => {
        // Setting the updatedLibrary in LibrariesContext triggers a useEffect
        // which updates the librariesInContext to include the updatedLibrary.
        setUpdatedLibrary(response);
      })
      .catch((err) => console.log(err));
  };

  const handleStageChange = (stage: string, value: string) => {
    // UPDATE_LIBRARY_STAGE endpoint expects the 'Library Stage' and the 'Registry
    // Stage', even if only one value has been updated.
    const body = new FormData();
    body.append('uuid', uuid);
    body.append(
      'Library Stage',
      stage === 'libraryStage' ? value : stages.library_stage
    );
    body.append(
      'Registry Stage',
      stage === 'registryStage' ? value : stages.registry_stage
    );

    fetch(UPDATE_LIBRARY_STAGE, {
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body,
    })
      .then((response) => {
        if (response.ok) {
          // If the POST request is successful, we'll follow it with a GET request
          // to fetch the library that was just updated.
          fetchUpdatedLibrary();
        } else {
          throw new Error('There was an issue updating this library.');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Form id={`registry-form-${uuid}`}>
        <FormRow>
          <FormField>
            <StageSelect
              uuid={uuid}
              stage='libraryStage'
              value={stages.library_stage}
              handleStageChange={handleStageChange}
            />
          </FormField>
          <FormField>
            <StageSelect
              uuid={uuid}
              stage='registryStage'
              value={stages.registry_stage}
              handleStageChange={handleStageChange}
            />
          </FormField>
        </FormRow>
      </Form>
      <Table
        columnHeaders={['', '']}
        tableData={getEmailData()}
        useRowHeaders
      />
      <Box paddingTop='m'>
        <Tabs id={`tabs-${uuid}`} tabsData={libraryTabsData} />
      </Box>
    </>
  );
};

export default LibraryDetails;
