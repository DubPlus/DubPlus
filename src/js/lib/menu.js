'use strict';
const settings = require('./settings.js');
const css = require('../utils/css.js');

import menuEvents from './menu-events.js';

// this is used to set the state of the contact menu section
var arrow = 'down';
var isClosedClass = '';
if (settings.menu.contact === 'closed') {
  isClosedClass = 'dubplus-menu-section-closed';
  arrow = 'right';
}

/*
<div id="dubplus-contact" class="dubplus-menu-section-header">
  <span class="fa fa-angle-${arrow}"></span>
  <p>Contact</p>
</div>
<ul class="dubplus-menu-section ${isClosedClass}">
  <li class="dubplus-menu-icon">
    <span class="fa fa-bug"></span>
    <a href="https://discord.gg/XUkG3Qy" class="dubplus-menu-label" target="_blank">Report bugs on Discord</a>
  </li>
  <li class="dubplus-menu-icon">
    <span class="fa fa-reddit-alien"></span>
    <a href="https://www.reddit.com/r/DubPlus/" class="dubplus-menu-label"  target="_blank">Reddit</a>
  </li>
  <li class="dubplus-menu-icon">
    <span class="fa fa-facebook"></span>
    <a href="https://facebook.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Facebook</a>
  </li>
  <li class="dubplus-menu-icon">
    <span class="fa fa-twitter"></span>
    <a href="https://twitter.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Twitter</a>
  </li>
</ul>`;
*/
function makeContactSection() {
  const fragment = new DocumentFragment();
  const contacts = [
    {
      icon: 'bug',
      link: 'https://discord.gg/XUkG3Qy',
      text: 'Report bugs on Discord',
    },
    {
      icon: 'reddit-alien',
      link: 'https://www.reddit.com/r/DubPlus/',
      text: 'Reddit',
    },
    {
      icon: 'facebook',
      link: 'https://facebook.com/DubPlusScript',
      text: 'Facebook',
    },
    {
      icon: 'twitter',
      link: 'https://twitter.com/DubPlusScript',
      text: 'Twitter',
    },
  ];

  const contactSection = document.createElement('div');
  contactSection.id = 'dubplus-contact';
  contactSection.className = 'dubplus-menu-section-header';
  contactSection.innerHTML = `
    <span class="fa fa-angle-${arrow}"></span>
    <p>Contact</p>
  `;
  contactSection.setAttribute(
    'onclick',
    `window.dubplus.toggleMenuSection('dubplus-contact')`
  );
  fragment.appendChild(contactSection);

  const contactList = document.createElement('ul');
  contactList.className = `dubplus-menu-section ${isClosedClass}`;

  contacts.forEach((contact) => {
    const contactItem = document.createElement('li');
    contactItem.className = 'dubplus-menu-icon';
    contactItem.innerHTML = `
      <span class="fa fa-${contact.icon}"></span>
      <a href="${contact.link}" class="dubplus-menu-label" target="_blank">${contact.text}</a>
    `;
    contactList.appendChild(contactItem);
  });

  fragment.appendChild(contactList);
  return fragment;
}

module.exports = {
  beginMenu: function () {
    // load font-awesome icons from CDN to be used in the menu
    css.loadExternal(
      'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
      'dubplus-font-awesome'
    );

    /*
      <div class="dubplus-icon">
        <img src="images/dubplus.svg" alt="" />
      </div>
    */
    // remove old one:
    document.querySelector('.dubplus-icon')?.remove();

    // create new one:
    const menuIcon = document.createElement('div');
    menuIcon.className = 'dubplus-icon';
    const iconImg = document.createElement('img');
    iconImg.src = `${settings.srcRoot}/images/dubplus.svg`;
    iconImg.alt = '';
    menuIcon.appendChild(iconImg);
    menuIcon.setAttribute('onclick', 'window.dubplus.toggleMenu()');

    document.querySelector('.header-right-navigation').appendChild(menuIcon);

    /*
      <section class="dubplus-menu">
        <p class="dubplus-menu-header">Dub+ Options</p>
      </section>
    */
    const menuContainer = document.createElement('section');
    menuContainer.className = 'dubplus-menu';
    const header = document.createElement('p');
    header.className = 'dubplus-menu-header';
    header.textContent = 'Dub+ Options';
    menuContainer.appendChild(header);
    return menuContainer;
  },

  finishMenu: function (menuObj, menuContainer) {
    // dynamically create our menu from strings provided by each module
    for (var category in menuObj) {
      var fixed = category.replace(' ', '-').toLowerCase();
      var menuSettings = settings.menu[fixed];
      var id = 'dubplus-' + fixed;

      var arrow = 'down';
      var isClosedClass = '';
      if (menuSettings === 'closed') {
        isClosedClass = 'dubplus-menu-section-closed';
        arrow = 'right';
      }

      /*
        <div id="{id}" class="dubplus-menu-section-header" onclick="...">
          <span class="fa fa-angle-{arrow}"></span>
          <p>{category}</p>
        </div>
        <ul class="dubplus-menu-section {isClosedClass}">
          {menuObj[category]}
        </ul>
      */

      const sectionHeader = document.createElement('div');
      sectionHeader.id = id;
      sectionHeader.className = 'dubplus-menu-section-header';

      const arrowSpan = document.createElement('span');
      arrowSpan.className = `fa fa-angle-${arrow}`;

      const p = document.createElement('p');
      p.textContent = category;

      sectionHeader.appendChild(arrowSpan);
      sectionHeader.appendChild(p);

      sectionHeader.setAttribute(
        'onclick',
        `window.dubplus.toggleMenuSection('${id}')`
      );

      const sectionUL = document.createElement('ul');
      sectionUL.className = `dubplus-menu-section ${isClosedClass}`;

      sectionUL.appendChild(menuObj[category]);

      menuContainer.appendChild(sectionHeader);
      menuContainer.appendChild(sectionUL);
    }

    // contact section last, is already fully formed, not dynamic
    menuContainer.appendChild(makeContactSection());

    document.body.appendChild(menuContainer);
  },

  makeOptionMenu: function (menuTitle, options) {
    const defaults = {
      id: '', // will be the ID selector for the menu item
      desc: '', // will be used for the "title" attribute
      state: false, // whether the menu item is on/off
      extraIcon: null, // define the extra icon if an option needs it (like AFK, Custom Mentions)
      cssClass: '', // adds extra CSS class(es) if desired,
      altIcon: null, // use a font-awesome icon instead of the switch
    };
    const opts = Object.assign({}, defaults, options);
    const switchState = opts.state ? 'dubplus-switch-on' : '';

    // default icon on the left of each menu item is the switch
    let mainCssClass = 'dubplus-switch';

    /*
       --- IF ALT ICON IS DEFINED ---
      <li id="{opts.id}" class="dubplus-menu-icon dubplus-switch-{on|off} {opts.cssClass}" title="{opts.desc}">
        <span class="fa fa-{opts.altIcon}"></span>
        <span class="dubplus-menu-label">{menuTitle}</span>
      </li>

      --- ELSE ---
      <li id="{opts.id}" class="dubplus-switch dubplus-switch-{on|off} {opts.cssClass}" title="{opts.desc}">
        <!-- IF EXTRA ICON -->
        <span class="fa fa-{opts.extraIcon} extra-icon"></span>
        <!-- ENDIF -->
        <div class="dubplus-switch-bg">
          <div class="dubplus-switcher"></div>
        </div>
        <span class="dubplus-menu-label">{menuTitle}</span>
      </li>
    */

    let mainIcon;
    if (options.altIcon) {
      mainCssClass = 'dubplus-menu-icon';
      mainIcon = document.createElement('span');
      mainIcon.className = `fa fa-${opts.altIcon}`;
      mainIcon.setAttribute(
        'onclick',
        `window.dubplus.onMenuAction('${opts.id}')`
      );
    } else {
      mainIcon = document.createElement('div');
      mainIcon.className = 'dubplus-switch-bg';
      const switcher = document.createElement('div');
      switcher.className = 'dubplus-switcher';
      mainIcon.appendChild(switcher);
      mainIcon.setAttribute(
        'onclick',
        `window.dubplus.onMenuToggle('${opts.id}')`
      );
    }

    const li = document.createElement('li');
    li.id = opts.id;
    li.className = `${mainCssClass} ${switchState} ${opts.cssClass}`.trim();
    li.title = opts.desc;

    if (opts.extraIcon) {
      const extra = document.createElement('span');
      extra.className = `fa fa-${opts.extraIcon} extra-icon`;
      extra.setAttribute('onclick', `window.dubplus.onMenuEdit('${opts.id}')`);
      li.appendChild(extra);
    }
    li.appendChild(mainIcon);

    const label = document.createElement('span');
    label.className = 'dubplus-menu-label';
    label.textContent = menuTitle;
    li.appendChild(label);

    return li;
  },
};
