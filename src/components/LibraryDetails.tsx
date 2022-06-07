import React, { useEffect, useState } from 'react';
import {
  Box,
  Form,
  FormField,
  FormRow,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@nypl/design-system-react-components';

import { LibrariesData } from '../../data/libraries';
import LibraryDetailsGrid from './LibraryDetailsGrid';
import StageSelect from './StageSelect';

interface LibraryDetailsProps {
  library: LibrariesData;
}

const LibraryDetails = ({ library }: LibraryDetailsProps) => {
  const {
    uuid,
    basic_info: basicInfo,
    urls_and_contact: urlsAndContact,
    areas,
    stages,
  } = library;
  const [libraryStage, setLibraryStage] = useState<string>('');
  const [registryStage, setRegistryStage] = useState<string>('');

  useEffect(() => {
    setLibraryStage(stages.library_stage);
  }, [stages.library_stage]);

  useEffect(() => {
    setRegistryStage(stages.registry_stage);
  }, [stages.registry_stage]);

  const getEmailData = () => {
    const emailData = [];
    for (const key in urlsAndContact) {
      if (key.split('_')[1] === 'email') {
        emailData.push([
          key.split('_').join(' '),
          urlsAndContact[key as keyof typeof urlsAndContact],
        ]);
      }
    }

    return emailData;
  };

  return (
    <>
      <Form id={`registry-form-${uuid}`}>
        <FormRow>
          <FormField>
            <StageSelect
              uuid={uuid}
              stage='libraryStage'
              value={libraryStage}
              handleChange={setLibraryStage}
            />
          </FormField>
          <FormField>
            <StageSelect
              uuid={uuid}
              stage='registryStage'
              value={registryStage}
              handleChange={setRegistryStage}
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
        <Tabs id={`tabs-${uuid}`}>
          <TabList>
            <Tab>Basic Information</Tab>
            <Tab>Contact & URLs</Tab>
            <Tab>Areas</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LibraryDetailsGrid content={basicInfo} />
            </TabPanel>
            <TabPanel>
              <LibraryDetailsGrid content={urlsAndContact} />
            </TabPanel>
            <TabPanel>
              <LibraryDetailsGrid content={areas} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default LibraryDetails;
