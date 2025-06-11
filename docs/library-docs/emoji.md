# Emoji Subsystem Documentation

## Overview
The emoji subsystem manages emoji data, merging, and assets in a modular, extensible way. It supports merging data from multiple sources, provides admin tools for data management, and is designed for easy integration into larger projects.

## Directory Structure
- `lib/emoji/` — Core logic, config, and utilities
- `public/dev/emoji/` — Generated emoji data files and assets
- `pages/api/dev/emoji/` — API routes for emoji admin/merge actions
- `pages/dev/emoji-assets.tsx` — Admin UI for emoji data management

## Config & Conventions
- **Config file:** `lib/emoji/config.ts` centralizes all emoji set definitions and paths.
- **Adding a set:** Add a new entry to the `sets` object and provide assets in `public/dev/emoji/`.
- **File conventions:**
  - Emoji data: `emoji-base.json`, `emoji-<set>.json`
  - Asset paths: `/dev/emoji/<set>/`

## API Endpoints
All emoji admin actions are exposed as API routes under `/api/dev/emoji/`.

### Example: Merge Gemoji Shortcodes
- **POST** `/api/dev/emoji/merge-gemoji-shortcodes`
- **Request:** No body required
- **Response (success):**
  ```json
  { "success": true, "updated": 123, "total": 456 }
  ```
- **Response (error):**
  ```json
  { "success": false, "error": "emoji-base.json not found. Build base first." }
  ```

### Other Endpoints
- `/api/dev/emoji/merge-iamcal-shortcodes` — Merge iamcal shortcodes
- `/api/dev/emoji/add-skin-tone-field` — Add skin tone field to emoji data

## Frontend Admin Tools
- Located in `pages/dev/emoji-assets.tsx`
- Each tool (button) triggers an API action and displays status
- Errors are shown clearly in the UI
- To add a new tool, create a new React component and connect it to an API route

## Error Handling
- All API endpoints return a standard shape: `{ success: boolean, ... }` or `{ error: string }`
- The frontend checks for errors and displays them to the user
- Common errors: missing files, fetch failures, invalid data

## Extending & Contributing
- **Add a new emoji set:** Update `lib/emoji/config.ts` and add assets
- **Add new merge logic:** Create a new API route in `pages/api/dev/emoji/`
- **Add new admin tools:** Extend the UI in `pages/dev/emoji-assets.tsx`
- **Testing:** Add unit tests for logic and integration tests for API endpoints

## Contact
For questions or contributions, see the main project README or open an issue. 