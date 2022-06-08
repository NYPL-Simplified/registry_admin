import React from 'react';
import { Select } from '@nypl/design-system-react-components';

import { LibraryStage } from './LibraryDetails';

interface StageSelectProps {
  handleChange: (stage: LibraryStage) => void;
  stage: string;
  uuid: string;
  value: LibraryStage;
}

const StageSelect = ({
  handleChange,
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
      onChange={(e) =>
        handleChange((e.target as HTMLTextAreaElement).value as LibraryStage)
      }
    >
      <option value='testing'>Testing</option>
      <option value='production'>Production</option>
      <option value='cancelled'>Cancelled</option>
    </Select>
  );
};

export default StageSelect;
