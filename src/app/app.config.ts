import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import ru from '@angular/common/locales/ru';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTransloco } from '@jsverse/transloco';
import { provideNzI18n, ru_RU } from 'ng-zorro-antd/i18n';
import { DITokens, provideUICCrud } from 'uic-crud';
import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';
import { TranslocoHttpLoader } from './pages/welcome/services/transloco-loader';

const LANGUAGES = {
  uz: 'O‘zbekcha',
  en: 'English',
  ru: 'Русский',
};
const DEFAULT_LANGUAGE: keyof typeof LANGUAGES = 'uz';
const GOOGLE_TRANSLATION_FROM: keyof typeof LANGUAGES = 'uz';

registerLocaleData(ru);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzIcons(),
    provideNzI18n(ru_RU),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),

    provideTransloco({
      config: {
        availableLangs: (
          Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>
        ).map((key) => ({
          label: LANGUAGES[key],
          id: key,
        })),
        defaultLang: DEFAULT_LANGUAGE,
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),

    provideUICCrud({
      languages: LANGUAGES,
      defaultLanguage: DEFAULT_LANGUAGE,
      translationFrom: GOOGLE_TRANSLATION_FROM,
    }),

    { provide: DITokens.API_BASE_URL, useValue: 'https://my.devel.uz' },
    {
      provide: DITokens.API_PATH_OPEN_GOOGLE_TRANSTATE,
      useValue: '/api/admin/Translation/TextTranslator',
    },
  ],
};
