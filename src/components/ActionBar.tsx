import React from 'react';
import {
  Button,
  Flex,
  Spacer,
  Toggle,
} from '@nypl/design-system-react-components';

interface ActionBarProps {
  logout: () => void;
  isSimpleList: boolean;
  setIsSimpleList: (isSimpleList: boolean) => void;
}

const ActionBar = ({
  logout,
  isSimpleList,
  setIsSimpleList,
}: ActionBarProps) => (
  <Flex alignItems='center'>
    <Toggle
      id='librariesView'
      isChecked={isSimpleList}
      labelText='View simple list'
      onChange={() => setIsSimpleList(!isSimpleList)}
    />
    <Spacer />
    <Button id='logout' onClick={logout}>
      Log Out
    </Button>
  </Flex>
);

export default ActionBar;
