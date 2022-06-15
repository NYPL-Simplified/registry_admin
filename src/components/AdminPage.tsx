import React, { useState } from 'react';
import {
  TemplateAppContainer,
  Toggle,
} from '@nypl/design-system-react-components';

import Header from './Header';
import LibrariesList from './LibrariesList';

const AdminPage = () => {
  const [isSimpleList, setIsSimpleList] = useState<boolean>(false);

  const onChange = () => {
    setIsSimpleList(!isSimpleList);
  };

  return (
    <div>
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
