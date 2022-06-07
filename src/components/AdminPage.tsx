import React, { useState } from 'react';
import {
  TemplateAppContainer,
  Toggle,
} from '@nypl/design-system-react-components';

import LibrariesList from './LibrariesList';
import Header from './Header';

const AdminPage = () => {
  const [isSimpleList, setIsSimpleList] = useState<boolean>(false);

  const onChange = () => {
    setIsSimpleList(!isSimpleList);
  };

  return (
    <div data-testid='library-registry'>
      <TemplateAppContainer
        renderSkipNavigation
        header={<Header />}
        contentTop={
          <Toggle
            id='librariesView'
            isChecked={isSimpleList}
            labelText='View simple list'
            onChange={onChange}
          />
        }
        contentPrimary={<LibrariesList isSimpleList={isSimpleList} />}
      />
    </div>
  );
};

export default AdminPage;
