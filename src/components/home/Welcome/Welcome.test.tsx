import { render } from '@testing-library/react';

import { Welcome } from './Welcome';

describe('<Welcome />', () => {
  it('should render component', () => {
    const { container } = render(<Welcome />);
    expect(container).toMatchSnapshot();
  });
});
