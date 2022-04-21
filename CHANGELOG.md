# Changelog

## Sprint 4

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

### Deprecated

### Removed

- Remove info paragraph about UTC and local times on settings page

### Fixed

### Security

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

## Sprint 1

The format is based on [Keep a Changelog](https://keepachangelog.com/).
