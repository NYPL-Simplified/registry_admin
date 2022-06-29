import * as React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import renderer from 'react-test-renderer';

import AdminPage from '../AdminPage';

describe('LibraryRegistryPage', () => {
  beforeEach(() => {
    render(<AdminPage />);
  });

  it('renders the header', () => {
    const header = screen.getByRole('heading', { level: 1 });

    expect(header).toHaveTextContent(/library registry interface/i);
  });

  it('renders all of the accordions correctly', () => {
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

describe('AdminPage Snapshot', () => {
  it('renders the UI snapshot correctly', () => {
    const page = renderer.create(<AdminPage />).toJSON();
    expect(page).toMatchSnapshot();
  });
});
