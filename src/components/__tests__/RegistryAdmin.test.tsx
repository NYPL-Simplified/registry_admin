import * as React from 'react';
import Cookies from 'js-cookie';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';

import RegistryAdmin from '../RegistryAdmin';
import { TokenContext } from '../../context/tokenContext';

const setAccessTokenMock = jest.fn();

const renderRegistryAdminWithContext = (
  accessToken: string,
  setAccessToken = setAccessTokenMock
) => {
  return render(
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <RegistryAdmin />
    </TokenContext.Provider>
  );
};

const renderRegistryForSnapshot = (
  accessToken: string,
  setAccessToken = setAccessTokenMock
) => {
  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <RegistryAdmin />
    </TokenContext.Provider>
  );
};

describe('RegistryAdmin, with no access token', () => {
  beforeEach(() => {
    renderRegistryAdminWithContext('');
  });

  it('renders the header', () => {
    const header = screen.getByRole('heading', { level: 1 });

    expect(header).toHaveTextContent(/library registry interface/i);
  });

  it('renders the login form', () => {
    const usernameInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText(/password/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    const submitButton = screen.getByRole('button');

    expect(submitButton).toHaveTextContent(/submit/i);
  });

  it('does not render admin page elements', () => {
    const listViewToggle = screen.queryByRole('checkbox');
    const buttons = screen.getAllByRole('button');

    expect(listViewToggle).not.toBeInTheDocument();
    // There are 16 buttons on the admin page, but only 1 on the
    // login page.
    expect(buttons.length).toEqual(1);
  });
});

describe('RegistryAdmin, with access token', () => {
  beforeEach(() => {
    renderRegistryAdminWithContext('mockAccessToken');
  });

  it('renders the header', () => {
    const header = screen.getByRole('heading', { level: 1 });

    expect(header).toHaveTextContent(/library registry interface/i);
  });

  it('renders the list toggle and logout button', () => {
    const listViewToggle = screen.getByRole('checkbox');
    const logoutButton = screen.getAllByRole('button')[0];

    expect(listViewToggle).toBeInTheDocument();
    expect(logoutButton).toHaveTextContent(/log out/i);
  });

  it('renders the list of libraries', () => {
    const libraryAccordions = screen.getAllByRole('button').slice(1);

    expect(libraryAccordions.length).toEqual(15);
  });
});

describe('RegistryAdmin, with no access token, but with refresh token', () => {
  it('tries to refresh the accessToken', () => {
    const realGet = Cookies.get;

    Cookies.get = jest.fn().mockImplementation(() => 'mockRefreshToken');
    (global as any).fetch = jest.fn().mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ access_token: 'mockAccessToken' }),
      })
    );

    renderRegistryAdminWithContext('');

    expect(fetch).toHaveBeenCalledWith(
      'https://qa-libraryregistry.librarysimplified.org/admin/refresh_token',
      { headers: { Authorization: 'Bearer mockRefreshToken' }, method: 'POST' }
    );

    Cookies.get = realGet;
    jest.clearAllMocks();
  });
});

describe('RegistryAdmin Snapshot', () => {
  it('renders the UI snapshot correctly', () => {
    const loginPage = renderer.create(renderRegistryForSnapshot('')).toJSON();
    const adminPage = renderer
      .create(renderRegistryForSnapshot('mockAccessToken'))
      .toJSON();

    expect(loginPage).toMatchSnapshot();
    expect(adminPage).toMatchSnapshot();
  });
});
