/**
 * Spacebar Mute
 * Turn on/off the ability to mute current song with the spacebar
 */

var myModule = {};
myModule.id = 'dubplus-spacebar-mute';
myModule.moduleName = 'Spacebar Mute';
myModule.description =
  'Turn on/off the ability to mute current song with the spacebar.';
myModule.category = 'Settings';

const clickableTags = ['input', 'textarea', 'button', 'select', 'a'];

function onSpacebar(event) {
  var tag = event.target.tagName.toLowerCase();
  if (
    event.which === 32 &&
    !clickableTags.includes(tag) &&
    !event.target.isContentEditable
  ) {
    QueUp.room.player.mutePlayer();
  }
}

myModule.turnOn = function () {
  $(document).on('keypress.key32', onSpacebar);
};

myModule.turnOff = function () {
  $(document).off('keypress.key32', onSpacebar);
};

module.exports = myModule;
