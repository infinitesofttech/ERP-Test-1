# Manufacturing CRM — Screenshot Analysis

## 1. Product and layout

The reference is a desktop-first manufacturing CRM/ERP dashboard at roughly a 2.75:1 viewport ratio. It uses a warm, low-contrast visual language: ivory page surfaces, white cards, brown brand actions, muted bronze accents, and restrained status colors.

### Page anatomy

1. **Left navigation (about 20% width)**
   - Company mark and product name at the top.
   - Eight vertically stacked modules.
   - Active module uses a dark brown filled pill with white text.
   - A small trust strip sits at the bottom: Quality · Innovation · Partnership.
2. **Top utility bar**
   - Wide global search.
   - Primary `+ New Lead` action.
   - Notification icon and compact user menu.
3. **Hero / operational summary**
   - Eyebrow: Manufacturing ERP.
   - Main title: Commercial Operations & 360° Job Traceability.
   - Short supporting description.
   - Industrial plant image/illustration on the right with a dark gradient overlay.
4. **KPI row**
   - Four equal cards: order booking, machines, critical expedite, quality compliance.
   - Each has a colored icon tile, label, primary value, and secondary trend/detail.
5. **Job tracking table**
   - Section header, search, stage filter, and compact table controls.
   - Six columns with a progress indicator and colored status pill.

## 2. Visual system inferred from the screenshot

- **Primary brand:** warm espresso/burnt umber.
- **Accent:** bronze/copper for icons and highlights.
- **Background:** warm ivory rather than pure gray.
- **Typography:** compact modern sans-serif. Use **Manrope** for UI and headings; fall back to `Inter`, `Segoe UI`, and system sans-serif.
- **Shape:** 8–12 px rounded corners; pills use a full radius.
- **Borders:** subtle warm-gray 1 px borders.
- **Elevation:** very light shadows; separation mostly comes from borders and surface color.
- **Density:** compact desktop controls and table rows; not a spacious marketing layout.

## 3. Color extraction notes

The reference is a compressed 796×291 image, so exact source colors cannot be recovered reliably. The supplied tokens are visually matched estimates and are organized semantically so the client can replace only the primitive brand values without editing every component.

| Role | Token | Value |
|---|---|---:|
| Brand action / active nav | `brand.700` | `#75401F` |
| Brand hover | `brand.800` | `#5F3218` |
| Bronze accent | `brand.500` | `#A96B34` |
| Page background | `neutral.50` | `#FBF8F3` |
| Warm secondary surface | `neutral.100` | `#F5EFE7` |
| Card surface | `surface.card` | `#FFFFFF` |
| Strong text | `text.primary` | `#211B17` |
| Muted text | `text.secondary` | `#70665F` |
| Border | `border.default` | `#E7DED5` |
| Info / production | `status.info` | `#0E91B2` |
| Success / compliance | `status.success` | `#169B62` |
| Danger / critical | `status.danger` | `#D94C64` |
| Inspection stage | `status.inspection` | `#A43D8F` |

## 4. Font specification

**Primary family:** Manrope

- Display: 30/36, ExtraBold
- Page title: 24/30, ExtraBold
- Section title: 16/22, Bold
- Card value: 18/24, ExtraBold
- Body: 13/20, Regular
- UI label: 12/16, SemiBold
- Caption/table meta: 10/14, Medium

For production, load Manrope through the app's font pipeline and keep the fallback stack from `crm-theme.css` to prevent layout shifts.

## 5. Responsive behavior

- **≥1280 px:** fixed 256 px sidebar, four KPI cards, full table.
- **768–1279 px:** collapsible 80 px icon rail, two-column KPI cards, horizontally scrollable table.
- **<768 px:** top app bar plus drawer navigation, single-column KPIs, job rows become stacked cards.

## 6. Accessibility and implementation notes

- Keep text contrast at WCAG AA; do not place small white text on `brand.500`.
- Never rely only on pill color for status—retain status text and/or icon.
- Use semantic table markup and visible keyboard focus.
- The hero image is decorative unless it communicates job/site context; use empty alt text when decorative.
- Theme overrides should change primitive palette tokens; semantic and component tokens should remain stable.
