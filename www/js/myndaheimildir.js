const _preloadedImages = new Map();

const _preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
  });
};

const _handlePreload = async (e) => {
  for (const a of e.currentTarget.getElementsByTagName("a")) {
    if (_preloadedImages.get(a.href)) {
      break;
    }

    try {
      const img = await _preloadImage(a.href);
      _preloadedImages.set(a.href, img);
    } catch {
      console.error(`(myndir.js) tókst ekki að forhlaða ${a.href}`);
    }
  }
};

const _handleShowPreview = (e) => {
  for (const tooltip of e.currentTarget.querySelectorAll('[role="tooltip"]')) {
    const preloadedImage = _preloadedImages.get(e.currentTarget.href);
    if (preloadedImage) {
      tooltip.appendChild(preloadedImage);
    } else {
      const img = new Image();
      img.src = e.currentTarget.href;
      tooltip.appendChild(img);
    }

    tooltip.setAttribute("aria-expanded", "true");
  }
};

const _handleHidePreview = (e) => {
  for (const tooltip of e.currentTarget.querySelectorAll('[role="tooltip"]')) {
    tooltip.setAttribute("aria-expanded", "false");

    for (const img of tooltip.getElementsByTagName("img")) {
      img.remove();
    }
  }
};

if (window.matchMedia("(pointer: fine)").matches) {
  for (const element of document.getElementsByClassName("img-citations")) {
    for (const li of element.getElementsByTagName("li")) {
      li.addEventListener("mouseenter", _handlePreload);

      for (const a of li.querySelectorAll('[class^="preload-listener-"]')) {
        a.addEventListener("mouseenter", _handlePreload);
      }
    }

    for (const a of element.getElementsByTagName("a")) {
      a.addEventListener("mouseenter", _handleShowPreview);
      a.addEventListener("mouseleave", _handleHidePreview);
    }
  }
}
