// Lightweight event bus using CustomEvent on window
export const emitEvent = (name, detail = {}) => {
  try {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  } catch (e) {
    // fallback
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(name, true, true, detail);
    window.dispatchEvent(evt);
  }
};

export const onEvent = (name, handler) => {
  window.addEventListener(name, handler);
};

export const offEvent = (name, handler) => {
  window.removeEventListener(name, handler);
};
