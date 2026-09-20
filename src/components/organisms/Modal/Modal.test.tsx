import { fireEvent, render, screen } from '@testing-library/react';
import Modal from 'src/components/organisms/Modal/Modal';
import { useModalStore } from 'src/store/ui';

const dialog = (container: HTMLElement) => container.querySelector('dialog') as HTMLDialogElement;

describe('<Modal />', () => {
  beforeEach(() => {
    useModalStore.setState({ name: 'About', data: undefined, isNotClose: false, isShow: true });
  });

  it('should open as a modal dialog', () => {
    const { container } = render(<Modal name="About" isNotClose={false} />);

    expect(dialog(container).open).toBe(true);
    expect(screen.getByText('about_iso')).toBeTruthy();
    expect(screen.getByText('description')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should render an empty dialog for an unknown name', () => {
    render(<Modal isNotClose={false} />);

    expect(screen.queryByText('about_iso')).toBe(null);
  });

  it('should close on the close button', () => {
    render(<Modal name="About" isNotClose={false} />);

    fireEvent.click(screen.getByRole('button'));

    expect(useModalStore.getState().isShow).toBe(false);
  });

  it('should close on a click on the backdrop', () => {
    const { container } = render(<Modal name="About" isNotClose={false} />);

    fireEvent.click(dialog(container));

    expect(useModalStore.getState().isShow).toBe(false);
  });

  it('should keep the modal open on a click inside of it', () => {
    render(<Modal name="About" isNotClose={false} />);

    fireEvent.click(screen.getByText('about_iso'));

    expect(useModalStore.getState().isShow).toBe(true);
  });

  it('should ignore backdrop clicks when closing is not allowed', () => {
    const { container } = render(<Modal name="About" isNotClose={true} />);

    fireEvent.click(dialog(container));

    expect(useModalStore.getState().isShow).toBe(true);
  });

  it('should let the escape key close it', () => {
    const { container } = render(<Modal name="About" isNotClose={false} />);

    const cancelled = !fireEvent(dialog(container), new Event('cancel', { cancelable: true }));

    expect(cancelled).toBe(false);
  });

  it('should block the escape key when closing is not allowed', () => {
    const { container } = render(<Modal name="About" isNotClose={true} />);

    const cancelled = !fireEvent(dialog(container), new Event('cancel', { cancelable: true }));

    expect(cancelled).toBe(true);
  });
});
