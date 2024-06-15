import { settings } from "./settings.svelte.js";

export function addMenuIcon() {
  if (document.querySelector(".dubplus-icon")) {
    document.querySelector(".dubplus-icon").remove();
  }
  const menuIcon = document.createElement("button");
  menuIcon.textContent = "Dub+";
  menuIcon.classList.add("dubplus-icon");
  menuIcon.innerHTML = `<img src="${settings.srcRoot}/images/dubplus.svg" alt="">`;

  document.querySelector(".header-right-navigation").appendChild(menuIcon);

  // hide/show the  menu when you click on the icon in the top right
  menuIcon.addEventListener("click", function () {
    document
      .querySelector(".dubplus-menu")
      .classList.toggle("dubplus-menu-open");
  });
}
