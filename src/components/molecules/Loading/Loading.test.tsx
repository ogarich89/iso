import { act, render, screen } from '@testing-library/react';
import { Loading } from 'src/components/molecules/Loading/Loading';

describe('<Loading />', () => {
  it('should render immediately without a timeout', () => {
    render(<Loading timeout={0} />);

    expect(screen.getByText('LOADING...')).toBeTruthy();
  });

  it('should render only after the timeout has passed', () => {
    vi.useFakeTimers();

    const { container } = render(<Loading timeout={300} />);

    expect(container.innerHTML).toBe('');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('LOADING...')).toBeTruthy();

    vi.useRealTimers();
  });
});
