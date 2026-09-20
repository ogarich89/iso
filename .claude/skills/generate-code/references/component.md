# Generating a component

## Contents
- Placement and naming
- Presentational component
- Component with props
- Component with state, i18n or store
- The stylesheet
- Icons and images
- Checklist

## Placement and naming

`<Owner>/components/<level>/<Name>/<Name>.tsx` plus `<Name>.module.scss` beside it, where `<Owner>` is
`src/modules/<domain>`, `src/layouts` or `src` (shared). PascalCase for the directory, the file and the
export. One component per file, named export, no default.

## Presentational component

The common case — no props, no state:

```tsx
import type { FunctionComponent } from 'react';
import style from './Example.module.scss';

export const Example: FunctionComponent = () => (
  <section className={style.example}>
    <strong>EXAMPLE</strong>
  </section>
);
```

## Component with props

Props get an interface above the component, or the domain type directly when the component *is* that entity:

```tsx
import type { FunctionComponent } from 'react';
import { Link } from 'src/components/molecules/Link/Link';
import type { Product } from 'src/modules/products/types';
import style from './Card.module.scss';

export const Card: FunctionComponent<Product> = ({ id, name, color }) => (
  <Link style={{ backgroundColor: color }} className={style.card} to={`/products/${id}`}>
    <div className={style.title}>
      <h4>{name}</h4>
    </div>
  </Link>
);
```

For a wrapper around one entity, prefer a named prop over spreading:
`FunctionComponent<{ product: Product }>`.

Combine a global class with a module class through `cx`:

```tsx
import cx from 'classnames';

<div className={cx('container', style.container)}>
```

`container` and `icon` are the only global classes (`src/app/App.scss`).

## Component with state, i18n or store

Hooks come first, handlers next, JSX last. No `useCallback`/`useMemo` unless something measurable needs it.

```tsx
import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModalStore } from 'src/store/ui';
import style from './Example.module.scss';

export const Example: FunctionComponent = () => {
  const { t } = useTranslation();
  const open = useModalStore((state) => state.open);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className={style.example}>
      <button type="button" onClick={handleClick}>
        {t('example')}
      </button>
      {isActive ? <button type="button" onClick={() => open({ name: 'About' })}>{t('about')}</button> : null}
    </nav>
  );
};
```

Rules that show up in review:
- anything clickable is a `<button type="button">` or an `<a>`, never a `<span role="button">`; the a11y lint
  rules are on and will reject the alternative;
- an overlay is a native `<dialog>` opened with `showModal()` (see `Modal.tsx`), which brings the focus trap,
  the Escape key and the backdrop for free;
- headings descend in order — a card title under an `h1` page title is an `h2`, not an `h4` picked for size;
- render nothing with `null`, never `false` or `<></>`;
- `{condition ? <X /> : null}`, not `&&`;
- translated copy goes through `t('key')` with the key added to `public/locales/{en,ru}/translation.json`;
- every `<button>` carries an explicit `type`.

## The stylesheet

Every class the component uses lives in its own module — no global styles, no inline style objects except
dynamic values (a colour from data). Read [styles.md](styles.md) before writing one: class names are
kebab-case in SCSS and camelCase in JS, and every size goes through the `vw` ladder.

```scss
@use "variables";
@use "mixins";

.example {
  display: flex;
  padding: mixins.vw(20px, variables.$desktop);
  @include mixins.respond-to(laptop) {
    padding: mixins.vw(20px, variables.$laptop);
  }
  @include mixins.respond-to(tablet) {
    padding: mixins.vw(20px, variables.$tablet);
  }
  @include mixins.respond-to(mobile) {
    padding: mixins.vw(20px, variables.$mobile);
  }
}
```

## Icons and images

```tsx
import { X } from 'lucide-react';
import RuIcon from 'src/assets/icons/russia-flag-icon.svg?react';

<X className="icon" />
<RuIcon />
```

Prefer `lucide-react`. A local SVG needs the `?react` suffix (SVGR) and belongs in `src/assets/icons/`;
strip any `type="text/css"` from an inline `<style>` in the file — it is an obsolete attribute.

## Checklist

- [ ] Test written first and red (`.claude/skills/tdd/SKILL.md`)
- [ ] Named export matching the file name
- [ ] `FunctionComponent` typing, props interface when it takes props
- [ ] Reuses `Link` / `Loading` / `PageNotFound` / `cx` rather than re-implementing them
- [ ] Stylesheet uses `@use "variables"` + `@use "mixins"` and the responsive ladder
- [ ] No comments, absolute imports, `bun run format` clean
