import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Logo } from 'src/layouts/components/atoms/Logo/Logo';

describe('<Logo />', () => {
  it('should link to the home page', () => {
    const { container } = render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link').getAttribute('href')).toBe('/');
    expect(container).toMatchSnapshot();
  });
});
