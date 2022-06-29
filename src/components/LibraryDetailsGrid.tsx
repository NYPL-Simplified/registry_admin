import React from 'react';
import { List } from '@nypl/design-system-react-components';

interface LibraryDetailsGridProps {
  content: Record<string, string | string[]>;
}

const LibraryDetailsGrid = ({ content }: LibraryDetailsGridProps) => {
  return (
    <List type='dl'>
      {Object.keys(content).map((key) => [
        <dt key={`${key}-0`}>{key}</dt>,
        <dd key={`${key}-1`}>{content[key]}</dd>,
      ])}
    </List>
  );
};

export default LibraryDetailsGrid;
