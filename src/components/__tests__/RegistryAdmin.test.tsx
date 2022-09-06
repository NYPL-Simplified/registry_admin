import * as React from 'react';
import Cookies from 'js-cookie';
import { act, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

import libraries from '../../../data/mockData';
import { LibrariesContext } from '../../context/librariesContext';
import RegistryAdmin, { LibraryData } from '../RegistryAdmin';
import { TokenContext } from '../../context/tokenContext';

const setAccessTokenMock = jest.fn();
const setLibrariesMock = jest.fn();
const setUpdatedLibraryMock = jest.fn();

const renderRegistryAdminWithContext = (
  accessToken: string,
  libraries: LibraryData[],
  setAccessToken = setAccessTokenMock,
  setLibraries = setLibrariesMock,
  setUpdatedLibrary = setUpdatedLibraryMock
) => {
  render(
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <LibrariesContext.Provider
        value={{ libraries, setLibraries, setUpdatedLibrary }}
      >
        <RegistryAdmin />
      </LibrariesContext.Provider>
    </TokenContext.Provider>
  );
};

const renderRegistryAdminForSnapshot = (
  accessToken: string,
  libraries: LibraryData[],
  setAccessToken = setAccessTokenMock,
  setLibraries = setLibrariesMock,
  setUpdatedLibrary = setUpdatedLibraryMock
) => {
  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <LibrariesContext.Provider
        value={{ libraries, setLibraries, setUpdatedLibrary }}
      >
        <RegistryAdmin />
      </LibrariesContext.Provider>
    </TokenContext.Provider>
  );
};

describe('RegistryAdmin, with no access token', () => {
  beforeEach(() => {
    renderRegistryAdminWithContext('', []);
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
  beforeEach(async () => {
    (global as any).fetch = jest.fn().mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ libraries: libraries }),
      })
    );

    await act(() =>
      renderRegistryAdminWithContext('mockAccessToken', libraries)
    );
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
  it('tries to refresh the accessToken', async () => {
    const realGet = Cookies.get;

    Cookies.get = jest.fn().mockImplementation(() => 'mockRefreshToken');
    (global as any).fetch = jest.fn().mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ access_token: 'mockAccessToken' }),
      })
    );

    await act(() => renderRegistryAdminWithContext('', []));

    expect(fetch).toHaveBeenCalledWith(process.env.REFRESH, {
      headers: { Authorization: 'Bearer mockRefreshToken' },
      method: 'POST',
    });

    Cookies.get = realGet;
  });
});

describe('RegistryAdmin Snapshot', () => {
  it('renders the UI snapshot correctly', async () => {
    (global as any).fetch = jest.fn().mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ libraries: libraries }),
      })
    );
    let loginPage;
    let adminPage;
    await act(() => {
      loginPage = renderer
        .create(renderRegistryAdminForSnapshot('', []))
        .toJSON();
      expect(loginPage).toMatchSnapshot();
    });

    await act(() => {
      adminPage = renderer
        .create(renderRegistryAdminForSnapshot('mockAccessToken', libraries))
        .toJSON();
      expect(adminPage).toMatchSnapshot();
    });
  });
});
