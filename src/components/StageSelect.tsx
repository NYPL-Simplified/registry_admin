import React from 'react';
import { Select } from '@nypl/design-system-react-components';

import { LibraryStage } from './LibraryDetails';

interface StageSelectProps {
  setLibraryStage: React.Dispatch<React.SetStateAction<LibraryStage>>;
  stage: 'libraryStage' | 'registryStage';
  uuid: string;
  value: LibraryStage;
}

const StageSelect = ({
  setLibraryStage,
  stage,
  uuid,
  value,
}: StageSelectProps) => {
  return (
    <Select
      id={`${stage}-${uuid}`}
      labelText={stage === 'libraryStage' ? 'Library Stage' : 'Registry Stage'}
      name={stage}
      value={value}
      onChange={(e: React.FormEvent<Element>) =>
        setLibraryStage((e.target as HTMLInputElement).value as LibraryStage)
      }
    >
      <option value='testing'>Testing</option>
      <option value='production'>Production</option>
      <option value='canceled'>Canceled</option>
    </Select>
  );
};

export default StageSelect;
