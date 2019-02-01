TODO: to finish the new preact version

~~Loading script~~    
- ~~eta~~
- ~~snooze~~
- ~~loading indicator~~
- ~~modal~~
- ~~Section headers~~

General    
- ~~autovote~~
- ~~AFK~~
- ~~Emotes~~
- AutoComplete Emoji
- ~~Custom Mentions~~
- ~~Chat Cleaner~~
- ~~Notifications on Mention~~
- ~~Notifications on PM~~
- ~~DJ Notifications~~
- ~~Show Dub on Hover~~
- ~~Downdubs in Chat (mods only)~~
- ~~Updubs in Chat~~
- ~~Grabs in Chat~~
- ~~Snow~~
- ~~Rain~~
Potential new feature:  Auto AFK.  Turns on AFK when away for more than X amount of time

UI    
- ~~Fullscreen video~~
- ~~Split Chat~~
- ~~Hide Chat~~
- ~~Hide Video~~
- ~~Hide Avatars~~
- ~~Hide Background~~
- ~~Show Timestamps~~

Settings    
- ~~Spacebar mute~~
- ~~Warn on navigation~~

Customize    
- ~~Community Theme~~
- ~~Custom CSS~~
- ~~Custom Background~~
- ~~Custom Notification Sound~~

Contact    
- Report bugs on Discord
- Reddit
- Facebook
- Twitter



-----

# Javascript info Guidelines
:warning: *this doc is a work in progress* :warning:

We're using Preact, because of its smaller size to React, so that we can bundle it with the library

## Folder structure

`./components/` - place all re-usable components in here

`./menu/` - Place all menu items in here. `./menu/index.js` is the main entry point to the menu and each subfolder represents a section of the menu

`./utils/` - **I'll probably rename this.** Place all non-UI building logic and utilities here. 

## Write tests for everything

### Unit Testing
At least everything in the utils folder should be unit tested. 

### Integration Testing
We're using Puppetteer and Jest to login into Dubtrack.fm, load the script, and perform integration testing in the actual environment

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


