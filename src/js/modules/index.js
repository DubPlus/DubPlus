// put this in order of appearance in the menu
module.exports = [
  // General 
  require('./snow.js'),
  require('./autovote.js'),
  require('./afk.js'),
  require('./emotes.js'),
  // autocomplete emoji
  // autocomplete mentions
  // cusomt mention triggers
  // notifications on mentions
  require('./showDubsOnHover.js'),
  // Downdubs in chat (mod only)
  // Updubs in chat
  require('./grabsInChat.js'),

  // User Interface
  require('./fullscreen.js'),
  require('./splitchat.js'),
  require('./hideChat.js'),
  require('./hideVideo.js'),
  require('./hideAvatars.js'),
  require('./hideBackground.js'),
  
  // Settings
  require('./spacebarMute.js'),
  require('./showTimestamps.js'),
  require('./warnOnNavigation.js'),

  // Customize
  require('./communityTheme.js'),
  require('./customCSS.js'),
  require('./customBackground.js'),

  // Contact
  require('./bugReport.js'),

  // non-menu modules
  require('./snooze.js'),
  require('./eta.js')
];