import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LanguageSwitch } from 'src/layouts/components/molecules/LanguageSwitch/LanguageSwitch';
import { session } from 'src/lib/session';

vi.mock('src/lib/session', () => ({ session: { set: vi.fn() } }));

describe('<LanguageSwitch />', () => {
  beforeEach(() => {
    vi.mocked(session.set).mockReset();
  });

  it('should render the current language', () => {
    render(<LanguageSwitch />);

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'en' })).toBeTruthy();
  });

  it('should toggle the language list', () => {
    render(<LanguageSwitch />);
    const [toggle] = screen.getAllByRole('button');

    fireEvent.click(toggle);

    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getAllByRole('button', { name: 'en' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'ru' })).toBeTruthy();

    fireEvent.click(toggle);

    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('should persist the selected language and close the list', async () => {
    render(<LanguageSwitch />);
    fireEvent.click(screen.getByRole('button'));

    fireEvent.click(screen.getByRole('button', { name: 'ru' }));

    await waitFor(() => expect(session.set).toHaveBeenCalledWith('language', { lng: 'ru' }));
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});
