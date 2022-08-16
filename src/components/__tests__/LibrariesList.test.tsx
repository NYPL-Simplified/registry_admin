import * as React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import renderer from 'react-test-renderer';

import libraries from '../../../data/mockData';
import { LibrariesContext } from '../../context/librariesContext';
import LibrariesList from '../LibrariesList';
import { TokenContext } from '../../context/tokenContext';

const setAccessTokenMock = jest.fn();
const setLibrariesInContextMock = jest.fn();
const setUpdatedLibraryMock = jest.fn();

const renderLibrariesListWithContext = (
  accessToken: string,
  isSimpleList = false,
  librariesInContext = libraries,
  setAccessToken = setAccessTokenMock,
  setLibrariesInContext = setLibrariesInContextMock,
  setUpdatedLibrary = setUpdatedLibraryMock
) => {
  render(
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <LibrariesContext.Provider
        value={{ librariesInContext, setLibrariesInContext, setUpdatedLibrary }}
      >
        <LibrariesList isSimpleList={isSimpleList} />
      </LibrariesContext.Provider>
    </TokenContext.Provider>
  );
};

const renderLibrariesListForSnapshot = (
  accessToken: string,
  isSimpleList = false,
  librariesInContext = libraries,
  setAccessToken = setAccessTokenMock,
  setLibrariesInContext = setLibrariesInContextMock,
  setUpdatedLibrary = setUpdatedLibraryMock
) => {
  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <LibrariesContext.Provider
        value={{ librariesInContext, setLibrariesInContext, setUpdatedLibrary }}
      >
        <LibrariesList isSimpleList={isSimpleList} />
      </LibrariesContext.Provider>
    </TokenContext.Provider>
  );
};

describe('LibrariesList, default view', () => {
  beforeEach(() => {
    renderLibrariesListWithContext('mockAccessToken');
  });

  it('renders a list of accordions', () => {
    const accordions = screen.getAllByRole('button');
    const plusIcons = screen.getAllByTitle('plus icon');

    expect(accordions.length).toEqual(15);
    expect(plusIcons.length).toEqual(15);

    const firstAccordion = accordions[0];

    expect(
      within(firstAccordion).getByText('Acton Public Library')
    ).toBeInTheDocument();

    const lastAccordion = accordions[14];

    expect(
      within(lastAccordion).getByText('Ansonia Public Library')
    ).toBeInTheDocument();
  });

  it('opens and closes an accordion correctly', () => {
    // First accordion starts closed
    expect(
      screen.getByRole('button', {
        name: 'Acton Public Library',
        expanded: false,
      })
    ).toBeInTheDocument();

    let firstAccordion = screen.getAllByRole('button')[0];

    // Open first accordion
    fireEvent.click(firstAccordion);

    expect(
      screen.getByRole('button', {
        name: 'Acton Public Library',
        expanded: true,
      })
    ).toBeInTheDocument();

    firstAccordion = screen.getAllByRole('button')[0];

    // Close first accordion
    fireEvent.click(firstAccordion);

    expect(
      screen.getByRole('button', {
        name: 'Acton Public Library',
        expanded: false,
      })
    ).toBeInTheDocument();
  });
});

describe('LibrariesList, simple view', () => {
  beforeEach(() => {
    renderLibrariesListWithContext('mockAccessToken', true);
  });

  it('renders a table of libraries', () => {
    const tableSections = screen.getAllByRole('rowgroup');

    // tableSections[0] is the thead, tableSections[1] is the tbody
    expect(tableSections.length).toEqual(2);

    const tableHeader = tableSections[0];
    const columnHeaders = within(tableHeader).getAllByRole('columnheader');

    expect(columnHeaders[0]).toHaveTextContent(/library name/i);
    expect(columnHeaders[1]).toHaveTextContent(/patron count/i);

    const tableBodyRows = within(tableSections[1]).getAllByRole('row');

    expect(tableBodyRows.length).toEqual(15);
  });
});

describe('LibrariesList Snapshot', () => {
  it('renders the UI snapshot correctly', () => {
    const defaultList = renderer
      .create(renderLibrariesListForSnapshot('mockAccessToken'))
      .toJSON();

    const simpleList = renderer
      .create(renderLibrariesListForSnapshot('mockAccessToken', true))
      .toJSON();

    expect(defaultList).toMatchSnapshot();
    expect(simpleList).toMatchSnapshot();
  });
});
