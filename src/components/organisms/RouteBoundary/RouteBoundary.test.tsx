import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Link, MemoryRouter, Route, Routes, StaticRouter } from 'react-router';
import { RouteBoundary } from 'src/components/organisms/RouteBoundary/RouteBoundary';
import { captureError } from 'src/lib/monitoring';

vi.mock('src/lib/monitoring', () => ({ captureError: vi.fn(), initMonitoring: vi.fn() }));

let shouldThrow = true;

const Flaky = () => {
  if (shouldThrow) {
    throw new Error('boom');
  }
  return <span>page content</span>;
};

describe('<RouteBoundary />', () => {
  beforeEach(() => {
    shouldThrow = true;
    vi.mocked(captureError).mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.mocked(console.error).mockRestore();
  });

  it('should show the error page instead of a blank screen', () => {
    render(
      <MemoryRouter>
        <RouteBoundary>
          <Flaky />
        </RouteBoundary>
      </MemoryRouter>,
    );

    expect(screen.getByText('SOMETHING WENT WRONG')).toBeTruthy();
    expect(captureError).toHaveBeenCalledWith(expect.any(Error), expect.anything());
  });

  it('should render the page again after a retry', () => {
    render(
      <MemoryRouter>
        <RouteBoundary>
          <Flaky />
        </RouteBoundary>
      </MemoryRouter>,
    );

    shouldThrow = false;
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('page content')).toBeTruthy();
  });

  it('should recover when the location changes', () => {
    render(
      <MemoryRouter initialEntries={['/broken']}>
        <RouteBoundary>
          <Routes>
            <Route path="/broken" element={<Flaky />} />
            <Route path="/working" element={<Link to="/broken">back</Link>} />
          </Routes>
        </RouteBoundary>
        <Link to="/working">go</Link>
      </MemoryRouter>,
    );

    expect(screen.getByText('SOMETHING WENT WRONG')).toBeTruthy();

    shouldThrow = false;
    fireEvent.click(screen.getByText('go'));

    expect(screen.queryByText('SOMETHING WENT WRONG')).toBe(null);
  });

  it('should let a server render error through, since renderToString has no boundaries', () => {
    expect(() =>
      renderToString(
        <StaticRouter location="/">
          <RouteBoundary>
            <Flaky />
          </RouteBoundary>
        </StaticRouter>,
      ),
    ).toThrow('boom');
  });
});
