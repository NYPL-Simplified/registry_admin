import React from 'react';
import { Select } from '@nypl/design-system-react-components';

import { LibraryStage } from './LibraryDetails';

interface StageSelectProps {
  error: string;
  handleStageChange: (stage: string, value: string) => void;
  stage: 'libraryStage' | 'registryStage';
  uuid: string;
  value: LibraryStage;
}

const StageSelect = ({
  error,
  handleStageChange,
  stage,
  uuid,
  value,
}: StageSelectProps) => {
  return (
    <Select
      id={`${stage}-${uuid}`}
      invalidText={error}
      isInvalid={error ? true : false}
      labelText={stage === 'libraryStage' ? 'Library Stage' : 'Registry Stage'}
      name={stage}
      onChange={(e: React.FormEvent<Element>) =>
        handleStageChange(stage, (e.target as HTMLInputElement).value)
      }
      value={value}
    >
      <option value='testing'>Testing</option>
      <option value='production'>Production</option>
      <option value='cancelled'>Cancelled</option>
    </Select>
  );
};

export default StageSelect;
