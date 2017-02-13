## Javascript notes and style guide

:warning: *this doc is a work in progress* :warning:

My TODO:
* ~~update afk.js menu item because forgot something~~    
* finish the remaining general items    
* test test test
* es6 conversion, babeljs, etc  (not super important now)

### Adding a new module

1. Create a new js file in `src/js/modules`

2. require your module in `src/js/modules/index.js`.  For organization's sake, place it in the section pertaining to what part of the menu you would like it added to (see comments in index.js).  If it's not a menu item, place it at the bottom.

#### YourModule.js

Each module is an object that you export with specific properties and methods. if you look at `src/js/lib/loadModules.js` you can see how each module is loaded and what's required in each.

Here's an example of a basic **properties**:

```Javascript
var myModule = {}; // myModule can be renamed to whatever you want. This is just for show.
myModule.id = "myID"; // MUST BE UNIQUE. will be used to bind events to, also #id of the menu item, also id of the module in the globalObject namespace
myModule.moduleName = "My Module Name"; // this will be used as the display text in the menu if this is a menu item
myModule.description = "This module does this thing"; // this will be used as the html title and alt attribute texts
myModule.optionState = false; // if it's a toggle menu item, this will save the on/off state of the module 
myModule.category = "general"; // if this is a menu item, this is the menu area that it will be added to
myModule.menuHTML = '';  // here will be an html string that will be the menu item.  
```

#### about `myModule.menuHTML = '';`    
You can either hand write your menu item html here or you can require the menu.js lib module and use `menu.makeStandardMenuHTML` or `menu.makeOtherMenuHTML`.  See `src/js/lib/menu.js` for more details on each.  For now here's an example `menu.makeStandardMenuHTML` which generates a menu item with the X or Checkmark.

```Javascript
menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);
```

Here's an example of a basic **methods**:

There are only 2 methods that the `src/js/lib/loadModules.js` looks for when loading a modules.

|  method  | desc  |
|:---|:---|
| `.init()` | this is where you put anything that needs to be executed as soon as the module is loaded.  This will only ever run once |
| `.go()` | This is your main execute function for your module. When a user clicks on the menu item, this is the function that is run.<br>When .go() is run, it will be passed one argument.  That argument is either an event object or a string.<br>`.go(event)` - when .go is the result of a click event from the menu.<br>`.go("onLoad")` - when .go is run from the loadModules.js because of a user's saved option |

don't forget to export at the end!

`module.exports = myModule;`