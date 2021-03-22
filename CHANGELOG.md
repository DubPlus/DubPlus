# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.3.0] - 2021-03-22
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
- Initial build of script.  Ready for testing and deploying. 
