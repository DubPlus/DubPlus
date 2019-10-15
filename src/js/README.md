# TODO
- plan out CI possibilities
- setup language coming from json

## Beta test

```javascript
javascript:var i,d=document,s=d.createElement('script');s.src="//cdn.jsdelivr.net/gh/DubPlus/DubPlus@beta/dubplus.js?"+Date.now();d.body.appendChild(s);void(0);
```


# Javascript info Guidelines
:warning: *this doc is a work in progress* :warning:

We're using Preact, because of its smaller size to React, so that we can bundle it with the library

## Folder structure

`./components/` - place all re-usable components in here

`./menu/` - Place all menu items in here. `./menu/index.js` is the main entry point to the menu and each subfolder represents a section of the menu

`./utils/` - **I'll probably rename this.** Place all non-UI building logic and utilities here.

## Write tests for non-ui building logic as much as you can

### Unit Testing
At least everything in the utils folder should be unit tested.

## Creating new menu items

```javascript
import {MenuSwitch, MenuPencil, MenuSimple} from '<srcDir/js>/components/menuItems.js';
```

### `MenuSwitch`
The menu switch requires 5 props and it will pass through any other props as usual. It can also contain children.

`@prop menuTitle` - the text to show in the menu
`@prop desc` - the description of what the menu item does (used in a `title` attribute)
`@prop turnOn` - function to run when switch is turned on
`@prop turnOff` - function to run when switch is turned off
`@prop id` - html element ID pass through

### `MenuPencil`
This should always be a child of the MenuSwitch. It's handles loading a modal and saving data from the modal. The props for MenuPencil are basically a pass-through to the `<Modal />` component.

`@prop title` - Text to show in the headline of the Modal
`@prop content` - Text to show in the description area of the Modal
`@prop placeholder` - Sample text inside the TextArea of the Modal
`@prop onConfirm` - function to run when user hits confirm

### `MenuSimple`
Use this to render a non-switch menu item like the fullscreen menu option (which
I think is the only one using it for now)

`@prop id` -  the dom ID name, usually dubplus-*
`@prop desc` -  description of the menu item used in the title attr
`@prop icon` -  icon to be used
`@prop menuTitle` -  text to display in the menu
`@prop onClick` -  the function to run on click
`@prop href` - optionally, if you provide this it will render an anchor element