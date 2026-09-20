import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Header } from 'src/layouts/components/molecules/Header/Header';
import { useModalStore } from 'src/store/ui';

vi.mock('src/lib/session', () => ({ session: { set: vi.fn() } }));

const renderHeader = () =>
  render(
    <MemoryRouter initialEntries={['/products']}>
      <Header />
    </MemoryRouter>,
  );

describe('<Header />', () => {
  beforeEach(() => {
    useModalStore.setState({ name: undefined, data: undefined, isNotClose: false, isShow: false });
  });

  it('should render the logo, the navigation and the language switch', () => {
    renderHeader();

    expect(screen.getByText('ISO')).toBeTruthy();
    expect(screen.getByText('products').getAttribute('href')).toBe('/products');
    expect(screen.getByText('about')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'en' })).toHaveLength(1);
  });

  it('should open the about modal from the navigation', () => {
    renderHeader();

    fireEvent.click(screen.getByText('about'));

    expect(useModalStore.getState()).toMatchObject({ name: 'About', isShow: true });
  });
});
