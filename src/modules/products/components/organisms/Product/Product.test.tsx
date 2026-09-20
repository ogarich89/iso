import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ProductComponent } from 'src/modules/products/components/organisms/Product/Product';

const product = { id: 1, color: '#98b2d1', pantone_value: '15-4020', year: 2000, name: 'cerulean' };

describe('<ProductComponent />', () => {
  it('should render the product with a link back to the list', () => {
    render(
      <MemoryRouter>
        <ProductComponent product={product} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('cerulean');
    expect(screen.getByText('← Back').getAttribute('href')).toBe('/products');
  });
});
