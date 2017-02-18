/**
 * Spacebar Mute
 * Turn on/off the ability to mute current song with the spacebar
 */

var myModule = {};
myModule.id = "dubplus-spacebar-mute";
myModule.moduleName = "Spacebar Mute";
myModule.description = "Turn on/off the ability to mute current song with the spacebar.";
myModule.category = "Settings";


myModule.start = function() {
  $(document).bind('keypress.key32', function(event) {
    var tag = event.target.tagName.toLowerCase();
    if (event.which === 32 && tag !== 'input' && tag !== 'textarea') {
      $('#main_player .player_sharing .player-controller-container .mute').click();
    }
  });
};

myModule.init = function(){
  if (this.optionState) {
    this.start();
  }
};

myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    this.start();
  } else {
    newOptionState = false;
    $(document).unbind("keypress.key32");
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;