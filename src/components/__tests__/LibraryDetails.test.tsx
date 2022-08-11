import * as React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import renderer from 'react-test-renderer';

import libraries from '../../../data/mockData';
import LibraryDetails from '../LibraryDetails';

describe('LibraryRegistryPage', () => {
  beforeEach(() => {
    render(<LibraryDetails library={libraries[0]} />);
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
});

describe('LibraryDetails Snapshot', () => {
  it('renders the UI snapshot correctly', () => {
    const page = renderer
      .create(<LibraryDetails library={libraries[0]} />)
      .toJSON();
    expect(page).toMatchSnapshot();
  });
});
