import { LANGUAGES } from 'i18n';
import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RuIcon from 'src/assets/icons/russia-flag-icon.svg?react';
import EnIcon from 'src/assets/icons/united-kingdom-flag-icon.svg?react';
import { session } from 'src/lib/session';
import style from './LanguageSwitch.module.scss';

const icons: Record<string, FunctionComponent> = {
  ru: RuIcon,
  en: EnIcon,
};

export const LanguageSwitch = () => {
  const { i18n } = useTranslation();
  const [active, setActive] = useState(false);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    await session.set('language', { lng });
    setActive(false);
  };

  const Icon = icons[i18n.language];

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div className={style.container}>
      <span className={style.language} role="button" onClick={handleClick}>
        <Icon />
        {i18n.language}
      </span>
      {active ? (
        <ul className={style.list}>
          {LANGUAGES.map((language, index) => {
            const Icon = icons[language];
            return (
              <li key={`language-${index}`}>
                <span className={style.language} role="button" onClick={() => changeLanguage(language)}>
                  <Icon />
                  {language}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
