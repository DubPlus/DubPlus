## Javascript notes and style guide

:warning: *this doc is a work in progress* :warning:

My TODO:
* add unit tests

### Adding a new menu item module

1. Create a new js file in `src/js/modules`

2. require your module in `src/js/modules/index.js`.  For organization's sake, place it in the section pertaining to what part of the menu you would like it added to (see comments in index.js).  If it's not a menu item, don't place it in the index.js file.

#### YourModule.js

Each module is an object that you export with specific properties and methods. if you look at `src/js/lib/loadModules.js` you can see how each module is loaded and what's required in each.



### Start by defining your module as an object:
```javascript
var myModule = {}; // `myModule` can be renamed to whatever you want. This is just for show.
```

### Add the following REQUIRED properties
```javascript
myModule.id = "myID"; // {string} 
```
MUST BE UNIQUE. This will be used to bind events to and the #id selector of the menu item, also id of the module in the window.dubplus namespace

```javascript
myModule.moduleName = "My Module Name"; // {string}
```
this will be used as the display text in the menu

```javascript
myModule.description = "This module does this thing"; // {string}
```
this will be used as the html title attribute text

```javascript
myModule.category = "General"; // {string}
```
Which menu section this should be added to. (case sensitive!)

### optional properties
```javascript
myModule.extraIcon = 'pencil' // {string} Default: 'pencil'
```
set the font-awesome icon to be used to trigger the .extra method.    It will automatically be prepended with "fa-"

### available properties
```javascript
myModule.optionState // {boolean}
```
on/off state of your menu item.  This is also set on load by checking a user's saved settings in localStorage

### REQUIRED methods
```javascript
myModule.init // {function}
```
this is run only once when the extension is loaded.  Check this.optionState here and start your module if needed

```javascript
myModule.go // {function}
```
this run everytime a user clicks on a menu item. Update your optionState here and also save your settings

### and finally 

don't forget to export at the end!

`module.exports = myModule;`