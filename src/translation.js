export const translations = {
  en: {
    "Modal.confirm": "okay",
    "Modal.cancel": "cancel",
    "Modal.close": "close",

    "Error.modal.title": "Dub+ Error",
    "Error.modal.loggedout": "You're not logged in. Please login to use Dub+.",
    "Error.unknown":
      "Something went wrong starting Dub+. Please refresh and try again.",

    "Loading.text": "Waiting for QueUp...",
    "Eta.tooltip.notInQueue": "You're not in the queue",
    "Eta.tootltip": "ETA: {{minutes}} minutes",
    "Snooze.tooltip": "Mute current song",

    "Notifcation.permission.title": "Desktop Notification",
    "Notification.permission.denied":
      "You have dismissed or chosen to deny the request to allow desktop notifications. Reset this choice by clearing your cache for the site.",
    "Notification.permission.notSupported":
      "Sorry this browser does not support desktop notifications.  Please update your browser to the lastest version",

    "Menu.title": "Dub+ Options",
    "general.title": "General",
    "user-interface.title": "User Interface",
    "settings.title": "Settings",
    "customize.title": "Customize",
    "contact.title": "Contact",
    "contact.bugs": "Report bugs on Discord",

    "Switch.on": "On",
    "Switch.off": "Off",

    // this text is only read by screen readers but we should still translate it
    // it is the label of the little pencil icon
    "MenuItem.edit": "Edit",

    "autovote.label": "Autovote",
    "autovote.description": "Toggles auto upvoting for every song",

    "afk.label": "AFK Auto-respond",
    "afk.description": "Toggle Away from Keyboard and customize AFK message.",
    "afk.modal.title": "Custom AFK Message",
    "afk.modal.content":
      "Enter a custom Away From Keyboard [AFK] message here. Message will be prefixed with '[AFK]'",
    "afk.modal.placeholder": "Be right back!",

    "emotes.label": "Emotes",
    "emotes.description": "Adds Twitch, Bttv, and FrankerFacez emotes in chat.",

    "autocomplete.label": "Autocomplete Emoji",
    "autocomplete.description":
      "Toggle autocompleting emojis and emotes. Shows a preview box in the chat",
    "autocomplete.preview.select": "press enter or tab to select",

    "custom-mentions.label": "Custom Mentions",
    "custom-mentions.description":
      "Toggle using custom mentions to trigger sounds in chat",
    "custom-mentions.modal.title": "Custom Mentions",
    "custom-mentions.modal.content":
      "Add your custom mention triggers here (separate by comma)",
    "custom-mentions.modal.placeholder":
      "separate, custom mentions, by, comma, :heart:",

    "chat-cleaner.label": "Chat Cleaner",
    "chat-cleaner.description":
      "Help keep CPU stress down by setting a limit of how many chat messages to keep in the chat box, deleting older messages.",
    "chat-cleaner.modal.title": "Chat Cleaner",
    "chat-cleaner.modal.content":
      "Please specify the number of most recent chat items that will remain in your chat history",
    "chat-cleaner.modal.validation": "Please enter a valid number",
    "chat-cleaner.modal.placeholder": "500",

    "mention-notifications.label": "Notification on Mentions",
    "mention-notifications.description":
      "Enable desktop notifications when a user mentions you in chat",

    "pm-notifications.label": "Notification on PM",
    "pm-notifications.description":
      "Enable desktop notifications when a user receives a private message",
    "pm-notifications.notification.title": "You have a new PM",

    "dj-notification.label": "DJ Notification",
    "dj-notification.description":
      "Get a notification when you are coming up to be the DJ",
    "dj-notification.modal.title": "DJ Notification",
    "dj-notification.modal.content":
      "Please specify the position in queue you want to be notified at",
    "dj-notification.notification.title": "DJ Alert!",
    "dj-notification.notification.content":
      "You will be DJing shortly! Make sure your song is set!",
    "dj-notification.modal.validation": "Please enter a valid number",

    "dubs-hover.label": "Show Dubs on Hover",
    "dubs-hover.description":
      "Show who dubs a song when hovering over the dubs count",
    "dubs-hover.no-votes": "No {{dubType}}s have been casted yet!",
    "dubs-hover.no-grabs": "No one has grabbed this song yet!",

    "downdubs-in-chat.label": "Downdubs in Chat (mods only)",
    "downdubs-in-chat.description":
      "Toggle showing downdubs in the chat box (mods only)",
    "downdubs-in-chat.chat-message":
      "@{{username}} has downdubbed your song {{song_name}}",

    "updubs-in-chat.label": "Updubs in Chat",
    "updubs-in-chat.description": "Toggle showing updubs in the chat box",
    "updubs-in-chat.chat-message":
      "@{{username}} has updubbed your song {{song_name}}",

    "grabs-in-chat.label": "Grabs in Chat",
    "grabs-in-chat.description": "Toggle showing grabs in the chat box",
    "grabs-in-chat.chat-message":
      "@{{username}} has grabbed your song {{song_name}}",

    "snow.label": "Snow",
    "snow.description": "Make it snow!",

    "rain.label": "Rain",
    "rain.description": "Make it rain!",

    "fullscreen.label": "Fullscreen",
    "fullscreen.description": "Toggle fullscreen video mode",

    "split-chat.label": "Split Chat",
    "split-chat.description": "Toggle Split Chat UI enhancement",

    "hide-chat.label": "Hide Chat",
    "hide-chat.description": "Toggles hiding the chat box",

    "hide-video.label": "Hide Video",
    "hide-video.description": "Toggles hiding the video box",

    "hide-avatars.label": "Hide Avatars",
    "hide-avatars.description": "Toggle hiding user avatars in the chat box",

    "hide-bg.label": "Hide Background",
    "hide-bg.description": "Toggle hiding background image",

    "show-timestamps.label": "Show Timestamps",
    "show-timestamps.description":
      "Toggle always showing chat message timestamps",

    "spacebar-mute.label": "Spacebar Mute",
    "spacebar-mute.description":
      "Turn on/off the ability to mute current song with the spacebar",

    "warn-redirect.label": "Warn on Navigation",
    "warn-redirect.description":
      "Warns you when accidentally clicking on a link that takes you out of QueUp",

    "community-theme.label": "Community Theme",
    "community-theme.description": "Toggle Community CSS theme",

    "custom-css.label": "Custom CSS",
    "custom-css.description": "Add your own custom CSS.",
    "custom-css.modal.title": "Custom CSS",
    "custom-css.modal.content": "Enter a url location for your custom css",
    "custom-css.modal.placeholder": "https://example.com/example.css",
    "custom-css.modal.validation": "Invalid URL",

    "custom-bg.label": "Custom Background",
    "custom-bg.description": "Add your own custom background.",
    "custom-bg.modal.title": "Custom Background Image",
    "custom-bg.modal.content":
      "Enter the full URL of an image. We recommend using a .jpg file. Leave blank to remove the current background image",
    "custom-bg.modal.placeholder": "https://example.com/big-image.jpg",

    "custom-notification-sound.label": "Custom Notification Sound",
    "custom-notification-sound.description":
      "Change the notification sound to a custom one.",
    "custom-notification-sound.modal.title": "Custom Notification Sound",
    "custom-notification-sound.modal.content":
      "Enter the full URL of a sound file. We recommend using an .mp3 file. Leave blank to go back to QueUp's default sound",
    "custom-notification-sound.modal.placeholder":
      "https://example.com/sweet-sound.mp3",
    "custom-notification-sound.modal.validation":
      "Can't play sound from this URL. Please enter a valid URL to an MP3 file.",
  },
};