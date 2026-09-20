import { act, fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes } from 'react-router';
import Main from 'src/layouts/main';
import { useModalStore } from 'src/store/ui';

vi.mock('src/lib/session', () => ({ session: { set: vi.fn() } }));

const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<Main />}>
          <Route path="/" element={<Link to="/products">go to products</Link>} />
          <Route path="/products" element={<span>products page</span>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('main layout', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    useModalStore.setState({ name: undefined, data: undefined, isNotClose: false, isShow: false });
  });

  it('should render the header around the current page', () => {
    renderLayout();

    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByText('go to products')).toBeTruthy();
  });

  it('should scroll to the top when the location changes', () => {
    renderLayout();

    fireEvent.click(screen.getByText('go to products'));

    expect(screen.getByText('products page')).toBeTruthy();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should render an open modal and lock the page', async () => {
    renderLayout();

    act(() => useModalStore.getState().open({ name: 'About' }));

    expect(await screen.findByText('about_iso')).toBeTruthy();
    expect(document.documentElement.className).toContain('hidden');
  });
});
