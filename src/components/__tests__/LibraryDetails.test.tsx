import * as React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import renderer from 'react-test-renderer';

import mockLibraries from '../../../data/mockData';
import LibraryDetails from '../LibraryDetails';
import { TokenContext } from '../../context/tokenContext';
import { LibrariesContext } from '../../context/librariesContext';

const mockFormData = new FormData();
mockFormData.append('uuid', '1');
mockFormData.append('Library Stage', 'testing');
mockFormData.append('Registry Stage', 'production');

const setAccessTokenMock = jest.fn();
const setLibrariesMock = jest.fn();
const setUpdatedLibraryMock = jest.fn();

const renderLibraryDetailsWithContext = (
  accessToken: string,
  libraries = mockLibraries,
  setAccessToken = setAccessTokenMock,
  setLibraries = setLibrariesMock,
  setUpdatedLibrary = setUpdatedLibraryMock
) => {
  render(
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <LibrariesContext.Provider
        value={{ libraries, setLibraries, setUpdatedLibrary }}
      >
        <LibraryDetails library={libraries[0]} />
      </LibrariesContext.Provider>
    </TokenContext.Provider>
  );
};

const renderLibraryDetailsForSnapshot = (
  accessToken: string,
  libraries = mockLibraries,
  setAccessToken = setAccessTokenMock,
  setLibraries = setLibrariesMock,
  setUpdatedLibrary = setUpdatedLibraryMock
) => {
  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <LibrariesContext.Provider
        value={{ libraries, setLibraries, setUpdatedLibrary }}
      >
        <LibraryDetails library={libraries[0]} />
      </LibrariesContext.Provider>
    </TokenContext.Provider>
  );
};

describe('LibraryRegistryPage', () => {
  beforeEach(() => {
    renderLibraryDetailsWithContext('mockAccessToken');
  });

  it('renders the library details correctly', () => {
    const selects = screen.getAllByRole('combobox');
    const libraryStageSelect = selects[0];
    const registryStageSelect = selects[1];

    expect(selects.length).toEqual(2);
    expect(libraryStageSelect).toHaveValue('production');
    expect(registryStageSelect).toHaveValue('production');

    const emailTable = screen.getByRole('table');
    const emailsForValidation = within(emailTable).getAllByRole('row');

    expect(emailsForValidation[1]).toHaveTextContent(/contact email/i);
    expect(emailsForValidation[2]).toHaveTextContent(/copyright email/i);
    expect(emailsForValidation[3]).toHaveTextContent(/help email/i);

    const tabButtons = screen.getAllByRole('tab');
    let tabPanel = screen.getByRole('tabpanel');

    expect(tabButtons.length).toEqual(3);
    expect(tabPanel).toBeInTheDocument();
    expect(tabPanel).toHaveTextContent(/number_of_patrons/i);

    const secondTab = tabButtons[1];
    const thirdTab = tabButtons[2];

    fireEvent.click(secondTab);

    tabPanel = screen.getByRole('tabpanel');

    expect(tabPanel).toBeInTheDocument();
    expect(tabPanel).toHaveTextContent(/web_url/i);

    fireEvent.click(thirdTab);

    tabPanel = screen.getByRole('tabpanel');

    expect(tabPanel).toBeInTheDocument();
    expect(tabPanel).toHaveTextContent(/focus/i);
  });

  it('makes the appropriate requests if the user changes the values of Library or Registry Stage', async () => {
    (global as any).fetch = jest
      .fn()
      .mockReturnValueOnce(
        Promise.resolve({
          ok: true,
          status: 200,
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          json: () => Promise.resolve(mockLibraries[0]),
          ok: true,
          status: 200,
        })
      );

    const selects = screen.getAllByRole('combobox');
    const libraryStageSelect = selects[0];

    fireEvent.change(libraryStageSelect, { target: { value: 'testing' } });

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(process.env.UPDATE_LIBRARY_STAGE, {
        body: mockFormData,
        headers: { Authorization: 'Bearer mockAccessToken' },
        method: 'POST',
      })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.REGISTRY_API_DOMAIN}/libraries/1`,
        {
          headers: { Authorization: 'Bearer mockAccessToken' },
        }
      );
    });
  });
});

describe('LibraryDetails Snapshot', () => {
  it('renders the UI snapshot correctly', () => {
    const page = renderer
      .create(renderLibraryDetailsForSnapshot('mockAccessToken'))
      .toJSON();
    expect(page).toMatchSnapshot();
  });
});
