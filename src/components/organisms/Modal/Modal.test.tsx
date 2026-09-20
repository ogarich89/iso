import { fireEvent, render, screen } from '@testing-library/react';
import Modal from 'src/components/organisms/Modal/Modal';
import { useModalStore } from 'src/store/ui';

const wrapper = (container: HTMLElement) => container.firstElementChild?.firstElementChild as HTMLElement;

describe('<Modal />', () => {
  beforeEach(() => {
    useModalStore.setState({ name: 'About', data: undefined, isNotClose: false, isShow: true });
  });

  it('should render the modal by name', () => {
    const { container } = render(<Modal name="About" isNotClose={false} />);

    expect(screen.getByText('about_iso')).toBeTruthy();
    expect(screen.getByText('description')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should render an empty modal for an unknown name', () => {
    render(<Modal isNotClose={false} />);

    expect(screen.queryByText('about_iso')).toBe(null);
  });

  it('should close on the close button', () => {
    render(<Modal name="About" isNotClose={false} />);

    fireEvent.click(screen.getByRole('button'));

    expect(useModalStore.getState().isShow).toBe(false);
  });

  it('should close on a click outside of the modal', () => {
    const { container } = render(<Modal name="About" isNotClose={false} />);

    fireEvent.click(wrapper(container));

    expect(useModalStore.getState().isShow).toBe(false);
  });

  it('should keep the modal open on a click inside of it', () => {
    render(<Modal name="About" isNotClose={false} />);

    fireEvent.click(screen.getByText('about_iso'));

    expect(useModalStore.getState().isShow).toBe(true);
  });

  it('should ignore outside clicks when closing is not allowed', () => {
    const { container } = render(<Modal name="About" isNotClose={true} />);

    fireEvent.click(wrapper(container));

    expect(useModalStore.getState().isShow).toBe(true);
  });
});
