import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../ErrorFallback';

describe('Error Boundary', () => {
  // Mocking console.error so that the errors thrown by the ThrowError
  // component below don't get logged to the console.
  beforeEach(() => {
    jest.spyOn(console, 'error');
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (console.error as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });
  test('Error Boundary', () => {
    const ThrowError = () => {
      throw new Error('There was a problem fetching the libraries.');
    };
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/there was a problem fetching/i)
    ).toBeInTheDocument();
  });
});
