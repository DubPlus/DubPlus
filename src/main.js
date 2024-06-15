import "./dubplus.css";
import { mount } from "svelte";
import DubPlus from "./DubPlus.svelte";

let container = document.getElementById("dubplus-container");
if (!container) {
  // Dub+ has not been loaded yet so we need to create the container
  container = document.createElement("div");
  container.id = "dubplus-container";
  document.body.appendChild(container);
}

const app = mount(DubPlus, {
  target: container,
});

export default app;
