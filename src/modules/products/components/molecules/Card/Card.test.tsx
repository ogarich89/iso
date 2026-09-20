import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Card } from 'src/modules/products/components/molecules/Card/Card';

const product = { id: 1, color: '#98b2d1', pantone_value: '15-4020', year: 2000, name: 'cerulean' };

describe('<Card />', () => {
  it('should render a product card linking to the product page', () => {
    const { container } = render(
      <MemoryRouter>
        <Card {...product} />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link');

    expect(link.getAttribute('href')).toBe('/products/1');
    expect(link.style.backgroundColor).toBe('rgb(152, 178, 209)');
    expect(screen.getByText('cerulean')).toBeTruthy();
    expect(screen.getByText('15-4020')).toBeTruthy();
    expect(screen.getByText('2000')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
