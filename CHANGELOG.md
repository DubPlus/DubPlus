# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [4.1.2] - TBD

### Other

Internal tooling and build process related changes. See this PR: https://github.com/DubPlus/DubPlus/pull/161

## [4.1.1] - 2025-08-29

### Fixed

- Fixed Collapsible Images bug: https://github.com/DubPlus/DubPlus/issues/154

### Other

- Re-organized build outputs so that built files are inside `extension/dist` folder.
- Added new task that zips the source code of the repo to help with Firefox add-on submission issues.

## [4.1.0] - 2025-07-24

### New Features

- "Pin Menu", allows user to pin the menu to the left or right and pushes over the content of the page so that it's no longer floating on top of it

### Fixed

- Emotes removes some emoji - https://github.com/DubPlus/DubPlus/issues/147

### Other

- Build process related fixes and updates to address FireFox Add-On review comments.
- update most packages to latest minor versions

## [4.0.3] - 2025-05-01

Updates to our build process. No changes to the extension itself.

## [4.0.2] - 2025-04-18

Bug fixes and Upgraded dependencies

### Fixed

- Fixed bug in collapsible images: [issue](https://github.com/DubPlus/DubPlus/issues/142)
- Fixed minor bug in Show Dubs on Hover when data was `undefined`

## [4.0.1] - 2025-03-25

### Fixed

Fixed a css bug that only affected FireFox: [issue](https://github.com/DubPlus/DubPlus/issues/136)

## [4.0.0] - 2025-03-24

The big leap in version number is to align with the version numbers we've been using for the extensions. We had 2 separate version numbers going and so now we'll just have one and be better about keeping with semantic versioning.

This is a complete rewrite of the code switching away from the old jQuery code to Svelte 5 [#108](https://github.com/DubPlus/DubPlus/issues/108). Also caught some existing bugs while updating.

The Chrome and Firefox extensions have been updated to use Manifest v3.

See the [v1 milestone for more details](https://github.com/DubPlus/DubPlus/milestone/1)

### New Features

- "Flip Interface", swaps the positions of the chat and video player
- "Auto AFK", when user is no longer focused on the page it starts a timer that auto-enables AFK when it expires [#38](https://github.com/DubPlus/DubPlus/issues/38)
- Snooze Video - hide the video for 1 song [#118](https://github.com/DubPlus/DubPlus/issues/118)
- Grab Response - send a message to the chat when you grab a song [#107](https://github.com/DubPlus/DubPlus/issues/107)
- Collapsible Images - images in chat can be collapsed/expanded [#74](https://github.com/DubPlus/DubPlus/issues/74)
- Modal improvments [#123](https://github.com/DubPlus/DubPlus/issues/123)
  - show default value within the modal
  - disable options if user leaves modal blank and there is no default value

### Breaking Changes

Some files deleted or moved. If you were accessing these files you'll need to update your urls. Most people will not have to worry about this.

**Deleted**:

- ~~`css/dubplus.min.css`~~

**Moved**:

- `css/dubplus.css` is now at the root: `./dubplus.css`

### Fixed

- Fullscreen wasn't working
- Fixed custom css not unloading when disabled if a css file was loaded

## [0.3.4] - 2024-07-05

### Fixed

- fixed [custom background bug](https://github.com/DubPlus/DubPlus/issues/87)
- fixed [Firefox add-on not loading jQuery](https://github.com/DubPlus/DubPlus/issues/112)

### Internal Changes

- upgraded repo to use Node v20+, npm v10+
- fixed PostCSS + Autoprefixer build issue due to the upgrade

## [0.3.3] - 2024-07-01

### Fixed

- Fixed autocomplete's keydown handler intefering with QueUp's new multiline chat feature

### Internal Changes

- the main change is that I set it up to be able to reload the extension without having to refresh the page. This is mostly helpful during development.
- replaced `node-sass` with `sass` (aka `dart-sass`) because `node-sass` is deprecated and they tell you to use `sass`

## [0.3.2] - 2021-11-23

### Fixed

- Fix snow animation breaking on window resize

## [0.3.1] - 2021-03-25

### Changed

- Update all npm packages to latest
- Update JS build and minification to support latest packages
- Update SASS build to support latest packages

### Fixed

- Fix Twitch Global emotes, BetterTTV Global emotes, and top 200 most popular FrankerFaceZ emotes from not loading
- Fix Rain animation from not loading and giving an "invalid invocation" error

## [0.3.0] - 2021-03-22

### Added

- Port to QueUp.net

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

- Initial build of script. Ready for testing and deploying.
