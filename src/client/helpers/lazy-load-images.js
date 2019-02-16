const lazyImageObserver = () => {
  if ('IntersectionObserver' in window) {
    window.lazyImageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          window.lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
  } else {
    window.lazyImageObserver = {
      observe(lazyImage) {
        lazyImage.src = lazyImage.dataset.src;
      }
    };
  }
};

export { lazyImageObserver };