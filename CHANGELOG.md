# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.0] - 2025-?-?

This is a complete rewrite of the code switching from the old jQuery code to Svelte 5. See this [PR](https://github.com/DubPlus/DubPlus/pull/110) for more details. Also caught some existing bugs while updating.

The Chrome and Firefox extensions have been updated to use Manifest v3.

### New Feature

- "Flip Interface", swaps the positions of the chat and video player

### Breaking Changes

We no longer produce minified versions of our code because we never used them and Chrome and Firefox extensions forbid them anyways:

- `dubplus.min.js`
- `css/dubplus.min.css`

We no longer have a `css/` folder, the `dubplus.css` is located at the root next to the `dubplus.js` file. If you were accessing these files you'll need to update your urls. Most people will not have to worry about this.

### Fixed

- Fullscreen wasn't working

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
