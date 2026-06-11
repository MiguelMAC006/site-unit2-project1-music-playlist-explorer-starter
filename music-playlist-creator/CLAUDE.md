# UI Design Reference

IMPORTANT:

The provided reference image is the primary source of truth for both styling and layout.

The application should resemble a desktop music player dashboard rather than a modern neon dashboard.

The design should feel:

* Minimal
* Elegant
* Music-focused
* Dark and atmospheric
* Professional
* Content-first

Avoid bright gradients, glowing effects, and flashy colors.

---

# Visual Design Rules

The interface should closely match the reference image.

Design characteristics:

* Dark navy/charcoal backgrounds
* Flat surfaces
* Warm pink/coral accent colors
* Large album artwork
* Clean typography
* Sharp visual hierarchy
* Subtle shadows
* Muted interface elements
* Professional music-player aesthetic
* Yellow play button for emphasis

Avoid:

* Neon effects
* Glassmorphism
* Excessive gradients
* Excessive rounding
* Gaming-inspired UI

---

# Color Palette

Primary Background:
#1E1F2E

Secondary Background:
#1A1B27

Sidebar Background:
#1A1B27

Card Background:
#2A2C3A

Modal Background:
#23242F

Hover Background:
#252632

Border Color:
#2F3042

Primary Text:
#FFFFFF

Secondary Text:
#B8B9C1

Muted Text:
#7A7B85

---

# Accent Colors

Primary Accent:
#C62828

Accent Hover:
#D32F2F

Accent Dark:
#8E1B1B

Accent Highlight:
#E53935

Like Button Active:
#C62828

Danger / Remove:
#B71C1C

Success Color:
#4CAF50

The red accent should be the primary branding color throughout the application.

Use red for:

* Active navigation items
* Selected states
* Like buttons
* Action buttons
* Important UI highlights
* Hero banner call-to-action buttons

Avoid using pink, purple, cyan, blue gradients, or neon colors.

The application should feel dark, moody, and music-focused with red serving as the primary visual accent.

Accent usage should resemble the reference image where small red highlights draw attention without overwhelming the interface.


---

# Typography

Font Family:

Inter, sans-serif

Alternative:

Poppins, sans-serif

Typography should be one of the strongest visual elements.

Use:

* Large page titles
* Medium section titles
* Smaller metadata text

Playlist titles should stand out clearly.

Authors and secondary information should be visually muted.

---

# Layout Rules

The application should closely follow the reference image layout.

Desktop Structure:

[ Sidebar ] [ Main Content ] [ Right Information Panel ]

The layout should occupy the full viewport height.

---

# Sidebar Layout

Width:

220px

Contains:

* Logo
* All Playlists
* Featured Playlist

Optional:

* Settings

The sidebar should remain visible at all times.

Use a darker background than the main content area.

Active navigation items should use the accent red color.

---

# Main Content Layout

The center section is the primary content area.

Top Area:

* Search bar
* Page title

Middle Area:

* Hero banner
* Playlist sections

Playlist sections should contain playlist cards displayed in a grid.

Suggested sections:

* Top Mixes
* Popular Playlists
* Featured Collections

The playlist grid should satisfy assignment requirements.

---

# Right Information Panel

Width:

280px

The right panel should remain visible on desktop screens.

This panel should resemble the music-player area shown in the reference image.

Contains:

* Featured Playlist Card
* Current Playlist Information
* Recently Viewed Playlists

This panel creates visual balance and should not be omitted.

---

# Playlist Card Rules

Cards should closely resemble those in the reference image.

Card structure:

* Cover image
* Playlist title
* Author
* Like count

Styling:

* Dark background
* Small border radius
* Minimal shadow

Recommended:

border-radius: 8px;

Cards should feel clean and structured.

Hover behavior:

* Slight lift
* Slight shadow increase

Avoid dramatic scaling effects.

---

# Hero Banner

The homepage should include a large hero banner.

Banner styling:

* Wide rectangular layout
* Dark overlay
* Large image background
* Text positioned on top

The banner should resemble a featured album or featured playlist area.

Keep the design minimal and elegant.

---

# Sidebar Navigation

Navigation should feel similar to the reference image.

Inactive items:

* Light gray text

Active items:

* Pink/coral accent color (#FF6B9D)

Hover:

* Slight brightness increase

No large pills or glowing effects.

---

# Modal Rules

Modal should match the overall dark theme.

Styling:

* Dark background
* Medium shadow
* Small border radius

Recommended:

border-radius: 10px;

box-shadow:
0 12px 32px rgba(0,0,0,0.35);

Overlay:

rgba(0,0,0,0.8)

The modal should feel like a desktop application window.

---

# Button Styling

Buttons should be simple and understated.

Primary Button:

Background:
#FF6B9D

Text:
#FFFFFF

Border Radius:
50px (pill shape)

Hover:
Slight brightness increase and shadow

Play Button (Special):

Background:
#FFD93D (yellow)

Text:
#1E1F2E (dark for contrast)

Border Radius:
50% (circular)

Avoid:

* Excessive gradients
* Neon glows

Buttons should match the clean desktop music-player aesthetic shown in the reference image.
