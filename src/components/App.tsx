import React from 'react';
import { DSProvider } from '@nypl/design-system-react-components';

import RegistryAdmin from './RegistryAdmin';
import { TokenProvider } from '../context/tokenContext';
import { LibrariesProvider } from '../context/librariesContext';

export function App() {
  return (
    <DSProvider>
      <TokenProvider>
        <LibrariesProvider>
          <RegistryAdmin />
        </LibrariesProvider>
      </TokenProvider>
    </DSProvider>
  );
}
