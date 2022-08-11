import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';

import LoginForm from '../LoginForm';
import { TokenContext } from '../../context/tokenContext';

const setAccessTokenMock = jest.fn();
const mockFormData = new FormData();
mockFormData.append('username', 'mockUser');
mockFormData.append('password', 'mockPassword');

const renderLoginFormWithContext = (
  accessToken: string,
  setAccessToken = setAccessTokenMock
) => {
  return render(
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <LoginForm />
    </TokenContext.Provider>
  );
};

const renderLoginForSnapshot = (
  accessToken: string,
  setAccessToken = setAccessTokenMock
) => {
  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <LoginForm />
    </TokenContext.Provider>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    renderLoginFormWithContext('');
  });

  it('renders form components', () => {
    const usernameInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText(/password/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    const submitButton = screen.getByRole('button');

    expect(submitButton).toHaveTextContent(/submit/i);
  });
});

describe('LoginForm, succcessful API call', () => {
  it('makes a call to the appropriate endpoint when a user submits', async () => {
    (global as any).fetch = jest.fn().mockReturnValueOnce(
      Promise.resolve({
        json: () =>
          Promise.resolve({
            access_token: 'mockAccessToken',
            refresh_token: 'mockRefreshToken',
          }),
        ok: true,
        status: 200,
      })
    );
    renderLoginFormWithContext('');
    const usernameInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button');

    fireEvent.change(usernameInput, { target: { value: 'mockUser' } });
    fireEvent.change(passwordInput, { target: { value: 'mockPassword' } });
    fireEvent.click(submitButton);

    expect(fetch).toHaveBeenCalledWith(process.env.LOGIN, {
      method: 'POST',
      body: mockFormData,
    });

    await waitFor(() =>
      expect(
        screen.queryByText(/your username or password is incorrect/i)
      ).not.toBeInTheDocument()
    );
  });
});

describe('LoginForm, unsuccessful API call', () => {
  it('shows the user an error if the they cannot be authenticated', async () => {
    const log = jest.spyOn(console, 'log');

    (global as any).fetch = jest.fn().mockReturnValueOnce(
      Promise.resolve({
        status: 401,
      })
    );
    renderLoginFormWithContext('');
    const usernameInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button');

    fireEvent.change(usernameInput, { target: { value: 'mockUser' } });
    fireEvent.change(passwordInput, { target: { value: 'mockPassword' } });
    fireEvent.click(submitButton);

    expect(fetch).toHaveBeenCalledWith(
      'https://qa-libraryregistry.librarysimplified.org/admin/log_in/jwt',
      { method: 'POST', body: mockFormData }
    );

    await waitFor(() => {
      expect(log).toHaveBeenCalledWith(
        'There was a problem authenticating this user in LoginForm.tsx.'
      );
      expect(
        screen.getByText(/your username or password is incorrect/i)
      ).toBeInTheDocument();
    });
  });
});

describe('Login Snapshot', () => {
  it('renders the UI snapshot correctly', () => {
    const loginPage = renderer.create(renderLoginForSnapshot('')).toJSON();

    expect(loginPage).toMatchSnapshot();
  });
});
