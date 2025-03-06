# Changelog

## Upcoming version

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## 5.3.0

### Added

- Support Witty Pi 4
- Add prettier formatter plugin for Shell scripts

### Changed

- Reference AutoHotspot-Installer from its repository
- Disable recording images on DiMON as videos are required for further analysis

### Fixed

- Allow switching between working time modes in same settings saving request
- Add unknown camera connection status

## 5.2.2

### Fixed

- Fix NewtCAM device not waking up at the scheduled time

## 5.2.1

### Changed

- Improve Motion option `video_params` handling

### Fixed

- Increase Motion option value `minimum_motion_frames` from 1 to 3 to not end videos too early for NewtCAM
- Correct camera palette in Motion to use maximum resolution and frame rate for NewtCAM
- Fix logging of triggering times
- Fix waking up NewtCAM the next day
- Allow changing focus if camera light is not changed at the same time
- Use external ffmpeg to encode movies faster and with a higher frame rate on NewtCAM
- Decrease value of Motion option `framerate` to 10 for lower CPU usage for NewtCAM

## 5.2.0

### Added

- Show camera connection status on dashboard
- Add upgrade procedure

### Changed

- Clarify wording of sunrise and sunset times displayed
- Allow access to motion web control and stream websites
- Update Motion on NewtCAM to version 4.7.0
- Set initial Motion config values of `threshold` to 17040, `lightswitch_percent` to 30, `lightswitch_frames` to 30 on NewtCAM
- Confirm compatibility with and use Node.js 22
- Add self-signed certificate to frontend and enforce HTTPS
- Add HTTPS reverse proxy to backend for /api
- Clean up layout of tools on the bottom of the settings pages
- Update dependencies

### Fixed

- Use correct date for calculating offset in sunrise time on daylight saving time change
- Read WiFi status on startup for correct LED display
- Prevent triggering due to switch from infrared to visible light by increasing wait time to 15 s

### Security

- Update root password

## 5.1.0

### Added

- Add snapshot button also to bottom of camera settings section
- Add Motion configuration files to repository and link them
- Add mask file to DiMON devices

### Changed

- Disable git commit hooks when using npm version command

### Fixed

- Revert use of exiftool argument for overwriting the original file
- Show truncated Y axis data labels in observations chart
- Add time zone offset to sunset and sunrise times calculations
- Fix tomorrow's calculation for sunrise time

## 5.0.0

### Added

- Write temperature value to metadata `Information` field of MP4 videos on Raspberry Pi
- Add setting of temperature threshold below whose value the device will not take shots
- Add latitude and longitude fields to the general settings for setting the device's location
- Display total observations per hour of the day on the dashboard
- Add read-only location accuracy to the general settings
- Request location from browser
- Add GPL3 license
- Add dialogue with license information that can be opened from footer
- Write location details as metadata to MP4 and JPG files
- Add setting for the device to sleep between sunset and sunrise
- Display connection lost popup also on Wi-Fi password change

### Changed

- Update dependencies in frontend
- Return media files sorted by date in descending order
- Provide one configuration file sample instead of two for both development and production
- Reorganise scripts folder in backend
- Subdivide temp folder for both archive and log file usage in backend
- Optimise requests for heading component on dashboard
- Make dashboard more compact

### Fixed

- Prevent triggering due to switch from infrared to visible light
- Update initial state of settings in frontend after a successful update

## 4.1.1

### Fixed

- Allow running Gitlab pipeline on tags

## 4.1.0

### Added

- Read temperature value from DS18B20 temperature sensor
- Write temperature value to metadata of JPG images on Raspberry Pi

### Changed

- Migrate from jest to vitest for unit tests in frontend
- Update dependencies in frontend
- Switch package manager from npm to pnpm in frontend

### Fixed

- Fix last command in release scripts
- Fix downloading Motion log file via App4Cam on newest NEWTCAM image

## 4.0.0

### Added

- Show battery level in Raspberry Pi too
- Support Witty Pi on Raspberry Pi for defining working hours
- Support getting and setting focus on Raspberry Pi
- Export settings file to data folder on each settings saving
- Support JSON file download
- Add setup script for enabling user services and USB auto-mounting
- Describe focus and threshold ranges in form fields hints
- Add focus and threshold range checks to form fields
- Log version at application startup

### Changed

- Update dependencies
- Improve error handling for getting and setting focus
- Represent working times as object inside JSON settings file
- Don't include working times, site name and device name in JSON settings file if they are not defined
- Hide trigger and recording light settings if device does not support them
- Split up settings' page into three settings' components

### Fixed

- Lower disk space usage threshold to 95% to reduce risk of overflown disk
- Add mask file for NewtCAM to auto-deployment
- Display error message from request response if it is available
- Fix Raspberry Pi loosing camera focus on reboot
- Switch to syslog for Motion logging to not overflow disk
- Fix broken USB auto-mount on NewtCAM by disabling preconfigured udev auto-mount rule
- Fix snapshot not being opened on Raspberry Pi by increasing waiting time for saving image to 2s
- Allow change of only one of both working times if both are set already
- Fix setting of year in RTC on NewtCAM
- Fix WiFi button on NewtCAM not working after auto-deployment

## 3.0.0

### Added

- Show number of changed pixels as text on shots
- Introduce recording light setting, with the restriction that infrared light cannot be used for recording when visible light is used for triggering
- Introduce camera focus setting
- Display connection lost popup when the device name is changed
- Add Wi-Fi password to settings
- Enable hardware WiFi toggle button on the NewtCAM board
- Add battery voltage to dashboard page
- Read battery voltage on the NewtCAM board
- Support RTC of the NewtCAM board
- Make NewtCAM boards also hibernate
- Add hardware initialisation scripts for the NewtCAM board
- Display LIST logo in header and note `by LIST` in footer
- Add copyright notice as comment to source code files
- Create setup and release scripts for frontend

### Changed

- Increase size of text on shots
- Adapt focus depending on recording light type
- Send only the changed settings to the backend
- Return patched settings so that frontend knows what has changed
- Update dependencies
- Rename tab and heading of file counts from Shots to Media
- Use colors from LIST communication guide as primary, secondary and accent colors

### Fixed

- Avoid fake loop phenomenon by enable light switch feature in motion
- Handle empty motion option `video_params`
- Not loosing access point connection when changing another general setting than device name
- Enable working time switch if both times are sent from the server

## 2.0.0

### Added

- Use Testing Library for component unit tests
- Reintroduce `device ID` as readonly property returning first MAC address
- Introduce setting `shot types` to indicate whether pictures or videos should be taken
- Automatically deploy to Variscite test devices
- Show dialog when time of device is more than 1 min off browser time
- Automatic addition of device ID as metadata to shots after saving them
- New config option `DEVICE_TYPE` in backend to define the device to run on
- Add OpenAPI Specification (OAS) using Swagger under `/api` in backend
- Introduce settings `picture quality` and `movie quality`
- Use infrared lights for triggering and visible lights for recording
- Allow safe swapping of USB stick, including creating API endpoint for getting and setting shots folder path
- Show storage status under disk usage graph, which checks for write access, and which displays subdirectories of `/media` in case of external storage devices
- Add dropdown button to download app and motion log files to settings page
- Introduce setting `trigger light` to switch between infrared and visible lights for triggering
- Introduce working hours settings and let device go to sleep
- Pause motion when below 1% of disk space usage
- Introduce setting `threshold`
- Add Gitlab issue template for bug reports
- Add mask file for NEWTCAM

### Changed

- Move code build from Pi to CI/CD runner
- Rename environment variable `VITE_API_SERVER_URL` to `API_SERVER_URL`
- Fix buttons to bottom of screen on shots page
- Display values rounded to the second decimal place on the right side
- Update dependencies
- Send dedicated delete all files request when all files are selected by passing `*` as single filename to delete all files using a dedicated command to not having to loop through all files
- Enforce alphabetical order of imports
- Extract version number and commit hash to file `version.txt` in backend upon build from where they are read from
- Rename setting `device ID` to `device name`
- Rename `version` to `properties/version` endpoint in backend
- Set body parser's `urlencoded` option `extended` to `false` in backend
- Allow setting `site name` to be empty
- Restructure settings' object
- Switch video format `mkv` to `mp4`
- Adapt video filter to use `mp4` instead of `mkv`
- Update motion to 4.5.1
- Don't open general settings section by default
- Use device name as access point name
- Adjust focus and brightness in motion
- Make storage chart is compatible to both internal and external storage devices
- Upgrade NestJS to version 10.x in backend

### Removed

- Disable storage chart tooltips
- Disable red frame on video output in motion

### Fixed

- Apache reloads correctly on pages with a path.
- Handle system time being not set when changing date and time on settings page
- Make sure mounting of storage devices continues to work after an error occurred
- Send newest media path to motion on startup
- Correctly handle CEST system times
- Disable automatic time sync during setup
- Handle undefined shots folder path

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
