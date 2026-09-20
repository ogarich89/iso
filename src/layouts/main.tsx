import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Header } from 'src/layouts/components/molecules/Header/Header';
import { setOverflow } from 'src/lib/dom';
import { useModalStore } from 'src/store/ui';

const Modal = lazy(() => import('src/components/organisms/Modal/Modal'));

const Main = () => {
  const { pathname } = useLocation();

  const [currentPathname, setPathname] = useState(pathname);
  const { name, data, isNotClose, isShow } = useModalStore();

  useEffect(() => {
    setOverflow(isShow);
  }, [isShow]);

  useEffect(() => {
    if (currentPathname !== pathname) {
      window.scrollTo(0, 0);
      setPathname(pathname);
    }
  }, [pathname]);

  return (
    <>
      <main>
        <Header />
        <Outlet />
      </main>
      {isShow ? (
        <Suspense fallback={null}>
          <Modal name={name} data={data} isNotClose={isNotClose} />
        </Suspense>
      ) : null}
    </>
  );
};

export default Main;
