import React from 'react';
import { Select } from '@nypl/design-system-react-components';

interface StageSelectProps {
  handleChange: (stage: string) => void;
  stage: string;
  uuid: string;
  value: string;
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
      onChange={(e) => handleChange((e.target as HTMLTextAreaElement).value)}
    >
      <option value='testing'>Testing</option>
      <option value='production'>Production</option>
      <option value='cancelled'>Cancelled</option>
    </Select>
  );
};

export default StageSelect;
