import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { App } from 'src/app/App';

const renderApp = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('<App />', () => {
  it('should render the home page', async () => {
    renderApp('/');

    expect(await screen.findByText('hello')).toBeTruthy();
  });

  it('should render the not found page for an unknown location', async () => {
    renderApp('/unknown');

    expect(await screen.findByText('PAGE NOT FOUND')).toBeTruthy();
  });
});
