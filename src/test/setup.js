import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
  delete document.documentElement.dataset.theme;
  document.documentElement.className = "";
});

// jsdom lacks these browser APIs
window.matchMedia ??= (query) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
});

window.IntersectionObserver ??= class {
  observe() {}
  disconnect() {}
};

window.scrollTo = () => {};
Element.prototype.scrollIntoView ??= () => {};

// No WebGL in jsdom: the hero keeps its flat plate drawing
HTMLCanvasElement.prototype.getContext = () => null;
