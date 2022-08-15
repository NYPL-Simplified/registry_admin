import React from 'react';
import { DSProvider } from '@nypl/design-system-react-components';

import RegistryAdmin from './RegistryAdmin';
import { TokenProvider } from '../context/tokenContext';
import { RegistryStagesProvider } from '../context/registryStagesContext';

export function App() {
  return (
    <DSProvider>
      <TokenProvider>
        <RegistryStagesProvider>
          <RegistryAdmin />
        </RegistryStagesProvider>
      </TokenProvider>
    </DSProvider>
  );
}
