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

and give it the following properties

```javascript
var myModule = { // "myModule" can be renamed to whatever you want. This is just for show.
  id : "myID", // {string}
  moduleName : "My Module Name", // {string}
  description : "This module does this thing", // {string}
  category : "General", // {string}

  extraIcon : "pencil" // {string} [optional] Default: "pencil"
  altIcon : "arrows-alt" // {string} [optional] 
};
```
**id**: MUST BE UNIQUE. This will be used to bind events to and the #id selector of the menu item, also id of the module in the window.dubplus namespace

**moduleName**: this will be used as the display text in the menu

**description**: this will be used as the html title attribute text

**category**: Which menu section this should be added to. (case sensitive!)

**extraIcon**: OPTIONAL - set the [font-awesome icon](http://fontawesome.io/icons/) to be used to trigger the .extra method. It will automatically be prepended with "fa-".

NOTE: the `.extraIcon` is optional and when you add a `.extra` method to your module (see below), you can still leave it out because the default 'pencil' icon will be used.  It's only when you don't want a pencil that you need to set it.

**altIcon**: OPTIONAL - used to replace the switch with a different icon.  See `src/js/modules/fullscreen.js` for an example

### REQUIRED methods

```javascript
myModule.turnOn = function(){}
myModule.turnOff = function(){}
```
obvious, put your module on and off functions in those. Option state is automatially set and save to localStorage.  On script load, if localStorage setting is on, then turnOn will be run.

### OPTIONAL methods

```javascript
myModule.init = function(){}
myModule.go = function(){}
```

**init**: this optional method is always run only once when the script is first loaded.

**go**: this is used to execute whatever you want when a user clicks a menu item but you don't want to set/save option state. See `src/js/modules/fullscreen.js` for an example.

NOTE: Do not declare both `.go` and `.turnOn+Off` functions in the same module.  It's either/or, not both.

### available properties

the following properties will be added to your modules dynamically when loaded. You don't really need to use them but they are there just in case.

```javascript
myModule.optionState // {boolean}

/**
 * @param {string} id - your module.id
 * @param {boolean} state - the on/off state of the curent module that you would like to set and save
 */
myModule.toggleAndSave(id, state) // {function}
```
**optionState**: on/off state of your menu item.  This is also set on load by checking a user's saved settings in localStorage.

**toggleAndSave**: if you need to save option state for any reason.

### and finally 

don't forget to export at the end!

`module.exports = myModule;` and `require` it in `src/modules/index.js`

OR eventually when we've completely switched over to ES6:

`export default myModule;` and `import` it in `src/modules/index.js`