const setOverflow = (isModalDisplayed: boolean): void => {
  const [html] = document.getElementsByTagName('html');
  const [content] = document.getElementsByTagName('main');
  if (isModalDisplayed) {
    if (!html.className.includes('hidden')) {
      const { scrollY } = window;
      try {
        sessionStorage.setItem('scroll', `${scrollY}`);
      } catch (e) {
        console.error(e);
      }
      if (scrollY !== 0) {
        content.style.transform = `translateY(-${scrollY}px)`;
      }
      html.classList.add('hidden');
    }
  } else {
    if (html.className.includes('hidden')) {
      html.classList.remove('hidden');
      const scrollY = sessionStorage.getItem('scroll') || '0';
      content.removeAttribute('style');
      window.scrollTo(0, +scrollY);
    }
  }
};
export { setOverflow };
