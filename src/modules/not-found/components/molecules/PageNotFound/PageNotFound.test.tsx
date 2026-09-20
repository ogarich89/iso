import { render, screen } from '@testing-library/react';
import { PageNotFound } from 'src/modules/not-found/components/molecules/PageNotFound/PageNotFound';

describe('<PageNotFound />', () => {
  it('should render component', () => {
    const { container } = render(<PageNotFound />);

    expect(screen.getByText('PAGE NOT FOUND')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
