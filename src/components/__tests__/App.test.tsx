import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

test('It should render hello world', () => {
  const app = render(<App />);
  screen.getByText('Hello world!');
  expect(app).toMatchSnapshot();
});
