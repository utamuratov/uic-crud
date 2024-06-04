import { ConfigOption, FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { TypeTranslateComponent } from '../components/type-translate/type-translate.component';
import { registerTranslateExtension } from './translate.extension';
import { TranslocoService } from '@jsverse/transloco';
import {
  EnvironmentProviders,
  Provider,
  importProvidersFrom,
} from '@angular/core';
import { FormlyPresetModule } from '@ngx-formly/core/preset';
import { DITokens, ILanguageConfig } from './di.tokens';

export function provideUICCrud(
  languageConfig: ILanguageConfig,
  ngxFormlyConfig?: ConfigOption
): (EnvironmentProviders | Provider)[] {
  return [
    importProvidersFrom(
      FormlyPresetModule,
      FormlyModule.forRoot({
        types: [
          { name: 'type-translate', component: TypeTranslateComponent },

          ...(ngxFormlyConfig?.types || []),
        ],
        presets: [
          {
            name: 'typeTranslate',
            config: {
              key: 'name',
              type: 'type-translate',
              fieldGroup: Object.keys(languageConfig.languages).map(
                (language) => {
                  return {
                    key: language,
                    type: 'input',
                    props: {
                      label: languageConfig.languages[language],
                      placeholder: 'Input placeholder',
                      required: true,
                    },
                  };
                }
              ),
            },
          },

          ...(ngxFormlyConfig?.presets || []),
        ],
      })
    ),

    // https://formly.dev/docs/examples/advanced/i18n-alternative/
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerTranslateExtension,
      deps: [TranslocoService],
    },
    {
      provide: DITokens.LANGUAGE_CONFIG,
      useValue: languageConfig,
    },
  ];
}
