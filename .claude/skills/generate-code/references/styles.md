# Generating SCSS

## Contents
- The two imports
- Design tokens
- `vw()` — every size is fluid
- `respond-to()` — the breakpoint ladder
- Class naming and nesting
- Global classes
- PurgeCSS
- Checklist

## The two imports

Every module stylesheet starts with:

```scss
@use "variables";
@use "mixins";
```

Both are aliases (`src/styles/variables.scss`, `src/styles/mixins.scss`) — never a relative path, never
`@import`. Members are always namespaced: `variables.$gray`, `mixins.vw(...)`, `mixins.respond-to(...)`.

## Design tokens

`src/styles/variables.scss` is the whole palette and the whole breakpoint set:

| Token | Value | Used for |
| --- | --- | --- |
| `$white` | `#E0E0E0` | text on the dark header |
| `$gray` | `#4D4D4D` | secondary text, borders, dropdown background |
| `$black` | `#000000` | header background |
| `$teal` | `#008080` | accent on light backgrounds (4.8:1 on white) |
| `$teal-light` | `#00A3A3` | the same accent on the dark header (6.8:1 on black; `$teal` only reaches 4.4:1 there) |
| `$orange` | `#D2691E` | accent |
| `$mobile` / `$tablet` / `$laptop` / `$desktop` | `425` / `768` / `1024` / `1920` | unitless breakpoint widths |

Add a token to `variables.scss` rather than repeating a literal colour. Literals appear in the codebase only
for one-off neutrals (`#fff`, `rgba(#000, .6)`, a `#ccc` shadow).

## `vw()` — every size is fluid

```scss
@function vw($object, $width)   // px value, design width → vw
```

`mixins.vw(20px, variables.$desktop)` means "20px in a 1920-wide design". Every length that should scale —
font sizes, padding, margin, width, border radius, offsets — goes through it. Exceptions are values that must
not scale: `100%`, `100vh`, `0`, hairline borders (`1px solid variables.$gray`), `min-width: 320px`.

## `respond-to()` — the breakpoint ladder

```scss
@include mixins.respond-to(laptop) { ... }
@include mixins.respond-to((tablet, mobile)) { ... }   // a list applies the same block to several
```

Accepted: `mobile` (≤425), `tablet` (426–768), `laptop` (769–1024), `desktop` (1025–1920), plus `landscape`
and `portrait`. The ranges are exclusive, **not** min-width cascades — a rule written only for `desktop` does
not reach a laptop. That is why the codebase repeats each fluid value four times:

```scss
.example {
  font-size: mixins.vw(20px, variables.$desktop);
  @include mixins.respond-to(laptop) {
    font-size: mixins.vw(20px, variables.$laptop);
  }
  @include mixins.respond-to(tablet) {
    font-size: mixins.vw(20px, variables.$tablet);
  }
  @include mixins.respond-to(mobile) {
    font-size: mixins.vw(20px, variables.$mobile);
  }
}
```

Generate that ladder for every fluid declaration, in that order (desktop base → laptop → tablet → mobile),
and change the px value per breakpoint only where the design actually differs (typically mobile).

## Contrast

Text must reach 4.5:1 against its background, which is why the palette carries two teals. When a colour comes
from data rather than the palette — a product colour behind a card — pick the foreground with
`isLightColor(hex)` from `src/lib/color` (black above the luminance threshold, white below) instead of
guessing a single colour that works "well enough".

## Class naming and nesting

- Class names are **kebab-case** in SCSS and read back as **camelCase** in JS: `.text-container` →
  `style.textContainer`. This is `localsConvention: 'camelCaseOnly'` — the kebab form does not exist in JS.
- One top-level class per component, named after the component (`.card`, `.products`, `.page-not-found`);
  children nest inside it.
- Style bare element selectors (`h4`, `ul li`, `svg`, `strong`) nested inside the component's class instead of
  inventing a class for every node — that is the existing house style.
- State classes nest as `&.active`, `&:hover`, `&:not(:last-child)`.

```scss
.card {
  padding: mixins.vw(20px, variables.$desktop);
  &:hover {
    box-shadow: #ccc 5px 5px 10px;
  }
  .title {
    h4 {
      color: variables.$gray;
    }
  }
}
```

## Global classes

`src/app/App.scss` owns the element defaults (`h1`–`h4`, `p`, `body`, `main`) and exactly two global classes:
`.container` (the centred 1600px-at-desktop wrapper) and `.icon` (a 24px square). Use them through `cx`:
`cx('container', style.container)`. Do not add new globals — a new shared visual goes in a component.

## PurgeCSS

The production build purges unused CSS with a kebab-aware extractor, so `style.closeBtn` in JS keeps
`.close-btn` in CSS. A class name assembled at runtime (`style[`is-${variant}`]`) is invisible to it and will
be purged — write the full name in the source.

## Checklist

- [ ] `@use "variables"` and `@use "mixins"` at the top, namespaced members
- [ ] Every fluid length via `mixins.vw(px, variables.$<breakpoint>)`
- [ ] Full laptop → tablet → mobile ladder for each fluid declaration
- [ ] Colours from tokens
- [ ] kebab-case classes, one root class, children nested
- [ ] No dynamically assembled class names
- [ ] `bun run stylelint` clean
