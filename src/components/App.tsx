import React from 'react';
import { DSProvider } from '@nypl/design-system-react-components';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorFallback from './ErrorFallback';
import RegistryAdmin from './RegistryAdmin';
import { TokenProvider } from '../context/tokenContext';
import { LibrariesProvider } from '../context/librariesContext';

export function App() {
  return (
    <DSProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <TokenProvider>
          <LibrariesProvider>
            <RegistryAdmin />
          </LibrariesProvider>
        </TokenProvider>
      </ErrorBoundary>
    </DSProvider>
  );
}
