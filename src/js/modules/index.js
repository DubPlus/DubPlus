// put this in order of appearance in the menu
module.exports = [
  // General 
  require('./autovote.js'),
  require('./afk.js'),
  require('./emotes.js'),
  // autocomplete emoji
  // autocomplete mentions
  require('./customMentions.js'),
  require('./desktopNotifications.js'),
  require('./showDubsOnHover.js'),
  // Downdubs in chat (mod only)
  // Updubs in chat
  require('./grabsInChat.js'),
  require('./snow.js'),
  
  // User Interface
  require('./fullscreen.js'),
  // require('./splitchat.js'),
  // require('./hideChat.js'),
  // require('./hideVideo.js'),
  // require('./hideAvatars.js'),
  // require('./hideBackground.js'),
  
  // // Settings
  // require('./spacebarMute.js'),
  // require('./showTimestamps.js'),
  // require('./warnOnNavigation.js'),

  // // Customize
  // require('./communityTheme.js'),
  // require('./customCSS.js'),
  // require('./customBackground.js'),

  // // Contact
  // require('./bugReport.js'),

  // non-menu modules
  require('./snooze.js'),
  require('./eta.js')
];