import { useModalStore } from 'src/store/ui';

describe('useModalStore', () => {
  beforeEach(() => {
    useModalStore.setState({ name: undefined, data: undefined, isNotClose: false, isShow: false });
  });

  it('should open a modal', () => {
    useModalStore.getState().open({ name: 'About', data: { id: 1 } });

    expect(useModalStore.getState()).toMatchObject({
      name: 'About',
      data: { id: 1 },
      isNotClose: false,
      isShow: true,
    });
  });

  it('should open a modal that cannot be closed by the user', () => {
    useModalStore.getState().open({ name: 'About', isNotClose: true });

    expect(useModalStore.getState().isNotClose).toBe(true);
  });

  it('should close a modal', () => {
    useModalStore.getState().open({ name: 'About' });
    useModalStore.getState().close();

    expect(useModalStore.getState()).toMatchObject({ name: 'About', isShow: false });
  });
});
