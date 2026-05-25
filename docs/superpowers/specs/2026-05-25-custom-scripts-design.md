# Custom Scripts Feature Design Document

## Overview

Allow admin users to inject custom HTML/JavaScript code into the public-facing pages of the Aysar website. This enables integration with third-party services like analytics, chat widgets, pixels, and other marketing tools.

## Requirements

1. **Two injection points:**
   - `<head>` section (before `</head>`)
   - `<body>` end (before `</body>`)

2. **Scope:** Public pages only (`/(public)/`)
   - Home (`/`)
   - Plans (`/plans`)
   - Contact (`/contact`)
   - Privacy Policy (`/privacy-policy`)
   - Terms of Use (`/terms-of-use`)
   - Return Policy (`/return-policy`)

3. **Security:** Admin is trusted - no code sanitization/validation

4. **UI:** Simple textarea fields in dashboard settings

## Architecture

### Database Schema

Add two columns to existing `site_settings` table:

```sql
ALTER TABLE site_settings ADD COLUMN head_scripts TEXT DEFAULT '';
ALTER TABLE site_settings ADD COLUMN body_scripts TEXT DEFAULT '';
```

**Data Type:** `TEXT` to support large scripts
**Default:** Empty string to maintain backward compatibility

### API Design

Extend existing `/api/settings` endpoints to include script fields:

- **GET** `/api/settings` - Returns `head_scripts` and `body_scripts`
- **PATCH** `/api/settings` - Accepts `head_scripts` and `body_scripts`

### Layout Integration

Modify `app/(public)/layout.tsx` to:
1. Fetch settings via `getSiteSettings()`
2. Inject `head_scripts` before `</head>` using `dangerouslySetInnerHTML`
3. Inject `body_scripts` at end of `<body>` using `dangerouslySetInnerHTML`

### Dashboard UI

Add new settings tab: "كود مخصص" (Custom Code)

**Components:**
- Textarea for Head Scripts (with label and help text)
- Textarea for Body Scripts (with label and help text)
- Save/Reset buttons (reuse existing SaveBar component)
- Character counter (optional, for UX)

### Component Structure

```
app/(dashboard)/dashboard/settings/
├── layout.tsx              # Add new tab
├── scripts/
│   └── page.tsx           # New settings page
```

## Data Flow

```
Admin Dashboard
      |
      v
[Textarea Input] -> [PATCH /api/settings]
                          |
                          v
                    [Supabase Update]
                          |
      +-------------------+
      |
      v
[Public Layout] -> [getSiteSettings()] -> [Inject Scripts]
      |
      v
[User's Browser]
```

## Security Considerations

⚠️ **Warning:** This feature allows arbitrary code execution. The admin must be trusted.

**Mitigations (optional future enhancements):**
- Add a confirmation dialog when saving
- Show security warning in UI
- Log script changes for audit

## Error Handling

1. **Database errors:** Return 500 with generic error message
2. **Invalid data:** API validates that scripts is string type
3. **Empty scripts:** Treat as empty string (not null)

## Backward Compatibility

- New columns have default empty string
- Existing settings rows will have empty scripts
- Layout handles missing/null gracefully

## Testing Strategy

1. **Unit:** API endpoint validation
2. **Integration:** Full flow - save in dashboard, verify in page source
3. **Edge cases:**
   - Empty scripts
   - Very large scripts
   - Special characters and HTML entities
   - Scripts with Arabic text

## Future Enhancements (Out of Scope)

- Toggle to enable/disable all scripts
- Per-page script targeting
- Script validation/warnings
- Version history for scripts
- Individual script management (name, position, enable/disable)
