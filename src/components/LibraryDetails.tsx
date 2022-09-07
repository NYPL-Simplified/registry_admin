import React, { useState } from 'react';
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
import useTokenContext from '../context/tokenContext';
import { UPDATE_LIBRARY_STAGE } from '../constants';
import useLibrariesContext, { LibraryData } from '../context/librariesContext';

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

  const [libraryStageError, setLibraryStageError] = useState<string>('');
  const [registryStageError, setRegistryStageError] = useState<string>('');

  const { accessToken } = useTokenContext();
  const { setUpdatedLibrary } = useLibrariesContext();

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

  const fetchUpdatedLibrary = (stage: string) => {
    const errorMessage =
      "We're having trouble displaying the updated stage. Try refreshing the page.";

    fetch(`${process.env.REGISTRY_API_DOMAIN}/libraries/${uuid}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          stage === 'libraryStage'
            ? setLibraryStageError(errorMessage)
            : setRegistryStageError(errorMessage);
          throw new Error(
            'There was an issue fetching the recently updated library.'
          );
        }
      })
      .then((response) => {
        // Setting the updatedLibrary in LibrariesContext triggers a useEffect
        // which updates the libraries in Context to include the updatedLibrary.
        setUpdatedLibrary(response);
      })
      .catch((err) => console.log(err.message));
  };

  const handleStageChange = (stage: string, value: string) => {
    // The UPDATE_LIBRARY_STAGE endpoint expects the 'Library Stage' and the
    // 'Registry Stage' values, even if only one is being updated.
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

    const errorMessage = 'Library did not update. Please try again.';

    fetch(UPDATE_LIBRARY_STAGE, {
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body,
    })
      .then((response) => {
        if (response.ok) {
          // Reset errors in state to empty strings just in case they are set
          // to an old error.
          setLibraryStageError('');
          setRegistryStageError('');
          // If the POST request is successful, we'll follow it with a GET request
          // to fetch the library that was just updated.
          fetchUpdatedLibrary(stage);
        } else {
          stage === 'libraryStage'
            ? setLibraryStageError(errorMessage)
            : setRegistryStageError(errorMessage);
          throw new Error('There was an issue updating this library.');
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <>
      <Form id={`registry-form-${uuid}`}>
        <FormRow>
          <FormField>
            <StageSelect
              error={libraryStageError}
              handleStageChange={handleStageChange}
              stage='libraryStage'
              value={stages.library_stage}
              uuid={uuid}
            />
          </FormField>
          <FormField>
            <StageSelect
              error={registryStageError}
              handleStageChange={handleStageChange}
              stage='registryStage'
              value={stages.registry_stage}
              uuid={uuid}
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
