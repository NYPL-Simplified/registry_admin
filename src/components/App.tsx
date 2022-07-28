import React from 'react';
import { DSProvider } from '@nypl/design-system-react-components';

import RegistryAdmin from './RegistryAdmin';
import { TokenProvider } from '../context/tokenContext';

export function App() {
  return (
    <DSProvider>
      <TokenProvider>
        <RegistryAdmin />
      </TokenProvider>
    </DSProvider>
  );
}
