import { fireEvent, render, screen } from '@testing-library/react';
import { PageError } from 'src/components/molecules/PageError/PageError';

describe('<PageError />', () => {
  it('should offer a way out of the error', () => {
    const onRetry = vi.fn();

    render(<PageError onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('SOMETHING WENT WRONG')).toBeTruthy();
    expect(onRetry).toHaveBeenCalled();
  });
});
