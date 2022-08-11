import React, { useEffect, useState } from 'react';
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

interface LibraryDetailsProps {
  library: LibraryData;
}

export type LibraryStage = 'testing' | 'production' | 'canceled' | '';

const LibraryDetails = ({ library }: LibraryDetailsProps) => {
  const {
    uuid,
    basic_info: basicInfo,
    urls_and_contact: urlsAndContact,
    areas,
    stages,
  } = library;
  const [libraryStage, setLibraryStage] = useState<LibraryStage>(
    stages.library_stage
  );
  const [registryStage, setRegistryStage] = useState<LibraryStage>(
    stages.registry_stage
  );

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

  return (
    <>
      <Form id={`registry-form-${uuid}`}>
        <FormRow>
          <FormField>
            <StageSelect
              uuid={uuid}
              stage='libraryStage'
              value={libraryStage}
              setLibraryStage={setLibraryStage}
            />
          </FormField>
          <FormField>
            <StageSelect
              uuid={uuid}
              stage='registryStage'
              value={registryStage}
              setLibraryStage={setRegistryStage}
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
