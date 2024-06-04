import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';
import { ru_RU, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormlyPresetModule } from '@ngx-formly/core/preset';
import {
  DITokens,
  LanguageConfig,
  NgxFormlyConfig,
  NgxFormlyProviders,
  TranslocoHttpLoader,
  TypeTranslateComponent,
  registerTranslateExtension,
} from 'uic-crud';
import { TranslocoService, provideTransloco } from '@jsverse/transloco';

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
        availableLangs: LanguageConfig.LanguageList.map((l) => ({
          label: LanguageConfig.LANGUAGES[l],
          id: l,
        })),
        defaultLang: LanguageConfig.DEFAULT_LANGUAGE,
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),

    importProvidersFrom(
      FormlyPresetModule,
      FormlyModule.forRoot({
        types: [...(NgxFormlyConfig.types || [])],
        presets: [...(NgxFormlyConfig.presets || [])],
      })
    ),

    { provide: DITokens.API_BASE_URL, useValue: 'https://my.devel.uz' },

    ...NgxFormlyProviders,
  ],
};
