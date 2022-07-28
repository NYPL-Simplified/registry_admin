import * as React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import renderer from 'react-test-renderer';

import LibrariesList from '../LibrariesList';

describe('LibrariesList, default view', () => {
  beforeEach(() => {
    render(<LibrariesList isSimpleList={false} />);
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

describe.only('LibrariesList, simple view', () => {
  beforeEach(() => {
    render(<LibrariesList isSimpleList />);
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
      .create(<LibrariesList isSimpleList={false} />)
      .toJSON();

    const simpleList = renderer
      .create(<LibrariesList isSimpleList={true} />)
      .toJSON();

    expect(defaultList).toMatchSnapshot();
    expect(simpleList).toMatchSnapshot();
  });
});
