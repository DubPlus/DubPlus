/**
 * Spacebar Mute
 * Turn on/off the ability to mute current song with the spacebar
 */

var myModule = {};
myModule.id = "dubplus-spacebar-mute";
myModule.moduleName = "Spacebar Mute";
myModule.description = "Turn on/off the ability to mute current song with the spacebar.";
myModule.category = "Settings";


myModule.turnOn = function() {
  $(document).bind('keypress.key32', function(event) {
    var tag = event.target.tagName.toLowerCase();
    if (event.which === 32 && tag !== 'input' && tag !== 'textarea') {
      Dubtrack.room.player.mutePlayer();
    }
  });
};

myModule.turnOff = function() {
  $(document).unbind("keypress.key32");
};

module.exports = myModule;