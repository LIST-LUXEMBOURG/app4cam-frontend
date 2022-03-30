# Changelog

## Sprint 4

### Added

- Display frontend version number at bottom of each page
- Display commit hash at bottom of each page
- Add delete confirmation dialog

### Changed

- Change delete button color to red
- Maximize snapshot view dialog
- Update dependencies

### Deprecated

### Removed

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
