---
name: Layanan Digital Desa
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#404940'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#707a6f'
  outline-variant: '#bfc9bd'
  surface-tint: '#1f6c3a'
  primary: '#004c22'
  on-primary: '#ffffff'
  primary-container: '#166534'
  on-primary-container: '#93e0a2'
  inverse-primary: '#8bd79b'
  secondary: '#1d4ed8'
  on-secondary: '#ffffff'
  secondary-container: '#4069f2'
  on-secondary-container: '#fffbff'
  tertiary: '#88000a'
  on-tertiary: '#ffffff'
  tertiary-container: '#b40011'
  on-tertiary-container: '#ffbfb8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a6f4b5'
  primary-fixed-dim: '#8bd79b'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#005226'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001551'
  on-secondary-fixed-variant: '#0039b5'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  container-max: 1280px
---

## Brand & Style

The design system is engineered for the Indonesian rural administrative context, prioritizing **professionalism, accessibility, and civic trust**. The visual direction is strictly **Modern Corporate**, utilizing a flat design philosophy that avoids unnecessary ornamentation to ensure clarity for users with varying levels of digital literacy.

The aesthetic is characterized by high-density information layouts, generous white space to reduce cognitive load, and a systematic hierarchy. By eschewing trends like glassmorphism or heavy gradients, the design system focuses on functional utility and the authoritative nature of government services. The emotional response should be one of reliability and institutional stability.

## Colors

The palette is rooted in a traditional civic color scheme, adapted for digital clarity. 

- **Primary Green (#166534):** Used for primary actions, success states, and branding elements to evoke growth and institutional officialdom.
- **Informational Blue (#1d4ed8):** Dedicated to links, secondary actions, and informational callouts.
- **Warning Red (#dc2626):** Reserved strictly for errors, destructive actions, and critical alerts.
- **Surface & Background:** The application uses a pure White (#ffffff) background for primary content areas to maximize contrast. Light Gray (#f8fafc) is used for grouping elements and background fills to provide subtle structural separation.
- **Borders (#e2e8f0):** Low-contrast gray is used for all structural lines, ensuring clear boundaries without visual noise.

## Typography

This design system utilizes **Inter** for all roles to leverage its exceptional legibility and systematic character widths, which are essential for data-heavy administrative interfaces.

- **Headlines:** Use Bold weights (700) with slight negative letter spacing for larger sizes to maintain a compact, authoritative feel.
- **Body Text:** Standardized at 16px for optimal readability across demographics. 
- **Labels:** Use Semi-bold weights (600) for form labels and table headers to distinguish them from input data.
- **Responsive Adjustments:** Large headlines scale down on mobile devices to prevent excessive line-breaking, while body text sizes remain constant to preserve accessibility.

## Layout & Spacing

The system is built on a **strict 8pt grid**. All margins, padding, and component heights must be multiples of 8px (or 4px for micro-adjustments).

- **Layout Model:** A fixed-fluid hybrid. The content is contained within a 1280px max-width container for desktop, centered on the screen.
- **Grid:** Use a 12-column grid for desktop (24px gutters) and a 4-column grid for mobile (16px gutters).
- **Spacing Rhythm:** Use `md (16px)` for internal component padding and `lg (24px)` for vertical stack spacing between distinct sections.
- **Mobile Reflow:** Elements should stack vertically on mobile. Data tables that exceed screen width should implement horizontal scrolling with a fixed first column for context.

## Elevation & Depth

This design system avoids shadows to maintain a clean, professional flat aesthetic. Depth is communicated through **Tonal Layering** and **Structural Outlines**:

- **Level 0 (Background):** #ffffff (White).
- **Level 1 (Subtle Sections):** #f8fafc (Light Gray) for sidebars, footer sections, or alternating table rows.
- **Borders:** All interactive elements (cards, inputs, buttons) use a 1px solid border (#e2e8f0). 
- **Focus States:** Use a 2px offset ring in Informational Blue (#1d4ed8) to denote keyboard navigation and active focus, ensuring high visibility for accessibility.

## Shapes

The shape language is professional and balanced. A `Rounded (0.5rem / 8px)` base radius is applied to all standard components to soften the interface slightly while maintaining a structured, formal appearance.

- **Standard Elements:** 8px radius (Buttons, Inputs, Cards).
- **Large Containers:** 12-16px radius for prominent modal overlays or dashboard widgets.
- **Small Elements:** 4px radius for tags or badges.

## Components

- **Buttons:** Primary buttons use the Primary Green background with White text. Secondary buttons use a White background with a Border Gray stroke and Blue text. Heights are standardized at 40px (md) and 48px (lg).
- **Inputs:** Fields must include a visible Label (Label-md) and optional Helper Text (Body-sm). Backgrounds are White with an #e2e8f0 border. On error, the border changes to Warning Red.
- **Data Tables:** High-priority component. Use #f8fafc for the header row. Borders should only be horizontal to emphasize row scanning. Include clear pagination controls at the footer.
- **Step Indicators:** Used for administrative submissions. Use a vertical layout for mobile and horizontal for desktop. Completed steps are Primary Green; active steps use a Blue outline.
- **Cards:** Used for dashboard widgets. Cards have a 1px border (#e2e8f0) and no shadow. Use a consistent 24px internal padding.
- **Chips/Badges:** Small, non-interactive indicators for status (e.g., "Selesai", "Proses"). Use low-saturation background tints of the status color with high-contrast text.