# Changelog

## Upcoming version

### Added

- Use Testing Library for component unit tests
- Reintroduce `device ID` as readonly property
- Introduce setting `shot types` to indicate whether pictures or videos should be taken
- Automatically deploy to Variscite test device
- Introduce setting `trigger sensitivity`
- Show dialog when time of device is more than 1 min off browser time

### Changed

- Move code build from Pi to CI/CD runner
- Rename environment variable `VITE_API_SERVER_URL` to `API_SERVER_URL`
- Fix buttons to bottom of screen on shots page
- Display values rounded to the second decimal place on the right side
- Update dependencies
- Rename setting `device ID` to `device name`
- Allow setting `site name` to be empty
- Restructure settings' object
- Adapt video filter to use `mp4` instead of `mkv`

### Deprecated

### Removed

- Disable storage chart tooltips

### Fixed

- Apache reloads correctly on pages with a path.

### Security

## Sprint 5 - version 1.1.1

### Fixed

- Require Node.js 16 or later

## Sprint 5 - version 1.1.0

### Added

- Use a dedicated config file for gitlab CI/CD
- Add Static Application Security Testing (SAST) as manual job to gitlab CI/CD

### Changed

- Use Apache instead of vite for serving this application
- Set IP address in app4cam config to 10.0.0.5

### Fixed

- Close multiple file download warning popup on confirmation
- Ignore tags for CI/CD

## Sprint 4 - version 1.0.0

### Added

- Display frontend version at bottom of each page
- Display frontend commit hash at bottom of each page
- Add delete confirmation dialog
- Filter shots by type
- Show loading bar on API calls
- Add time zone setting
- Display backend commit hash and version at bottom of each page
- Explain different times used on shots page
- Include time zone in filenames
- Display warning dialog when downloading more than 10 files at the same time

### Changed

- Change delete button color to red
- Maximize snapshot view dialog
- Update dependencies
- Rename from PolliCAM to App4Cam
- Move time zone field before date and time field on settings page

### Removed

- Remove info paragraph about UTC and local times on settings page

## Sprint 3

### Added

- Select all and unselect all files
- Delete one or multiple files
- Take and view snapshot
- Export settings
- Import settings
- Display disk space usage

### Changed

- Reject underscore in device ID and site name
- Change endpoint to download multiple files from POST /files/download to POST /files
- Only deploy after passing tests by using stages in Gitlab pipeline
- Update dependencies
- Replace Vuex with Pinia state management

### Removed

- Remove page headings on shots and settings pages

### Fixed

- Fix date field by prepending zero to single-digit days
- Reset selected files after deletion
- Remove files from state before fetching new file list

## Sprint 2

_See commits_

## Sprint 1

_See commits_

The format is based on [Keep a Changelog](https://keepachangelog.com/).
