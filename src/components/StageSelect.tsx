import React from 'react';
import { Select } from '@nypl/design-system-react-components';

import { LibraryStage } from './LibraryDetails';

interface StageSelectProps {
  handleStageChange: (stage: string, value: string) => void;
  stage: 'libraryStage' | 'registryStage';
  uuid: string;
  value: LibraryStage;
}

const StageSelect = ({
  handleStageChange,
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
        handleStageChange(stage, (e.target as HTMLInputElement).value)
      }
    >
      <option value='testing'>Testing</option>
      <option value='production'>Production</option>
      <option value='cancelled'>Cancelled</option>
    </Select>
  );
};

export default StageSelect;
