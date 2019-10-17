# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2019-10-14
### Changes
- removed any use or dependency of jQuery
- switched to RollupJS for building
- slowly adding in unit tests for some of the logic
- A complete rewrite from the ground up in `Preact`, which is a 3kb alternative with 1:1 feature parity with `React`.  
- Emotes and Autocomplete Emoji have been completely revamped. Using a better system to replace emotes in chat and autocomplete has been redesigned and has an improved keyboard navigation. 
  - one thing to note is that autocomplete can now only replace an emote/emoji at the end of the chat input and not in the middle, this is how Dubtrack's user autocomplete works and it simplified and stabilized the code for this feature 
- We've drastically reduced the amount of Twitch emotes supported to only a handful of Twitch channels and the global ones. We're now using way less memory so we no longer need to store emote data in localStorage or indexedDB. We also no longer call the Twitch or BTTV emote APIs directly. Emotes are bundled with the extension as JSON data and spritesheets. A separate repo has been setup to update and create the spritesheets and JSON.

### New!
- `preview next song` - places a small banner above the chat input that shows the next song you have in the room queue
- `emoji and twitch/bttv pickers`! look for the 2 new icons in the chat input next to the markdown info icon. 
- `Hide gif-selfie` switch in the UI section. Toggles the icon in the chat input so you gain a little extra room
- `Filter playlists in grabs` - Adds 'filter as you type' functionality to the 'create a new playlist' input inside the grab to playlist popup

- on the dev side we've added [husky](https://www.npmjs.com/package/husky) to ensure everything is rebuilt before committing and after merging

### Fixed
- Fixed Twitch emotes not loading. 
- Fixed Emote/Emoji Auto-complete not working 

### Removed
- Tasty emote support


-------

## [0.2.0] - 2018-12-21
### Fixed
- Fix autovote not voting

## [0.1.9] - 2018-12-10
### Fixed
- Fix multiple errors with Dubtrack changes

### Removed
- Removed perfect-scrollbar support

## [0.1.8] - 2018-05-22
### Added
- Add support for FrankerFaceZ emotes

### Changed
- Update custom mentions to only trigger when a whole word is matched rather than a partial word

## [0.1.7] - 2017-11-22
### Changed
- Update Twitch emojis to save to IndexedDB instead of localStorage. We were hitting the 5mb storage limit on localStorage, and using IndexedDB increases the limit to 50mb.

## [0.1.6] - 2017-06-30
### Changed
- Update Twitch API to v5

## [0.1.5] - 2017-06-02
### Changed
- Fix storing for Twitch and BetterTwitchTV emotes, fixes exceeded quota error for local storage
- Fix AFK not unbinding to chat event when turned off

## [0.1.4] - 2017-05-13
### Changed
- Add community theme support for `@dub+=...`
- Fix community theme support for `@dubplus=...`

## [0.1.3] - 2017-03-18
### Changed
- Hotfix for lodash v4 upgrade breaking change

## [0.1.2] - 2017-03-08
### Changed
- Chrome Extension Autodeploy testing, needed to increment package number

## [0.1.1] - 2017-03-07
### Changed
- updated extension icons

## [0.1.0] - 2017-03-06
### Added
- Initial build of script.  Ready for testing and deploying. 
