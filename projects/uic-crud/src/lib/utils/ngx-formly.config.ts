import { ConfigOption, FORMLY_CONFIG } from '@ngx-formly/core';
import { LanguageConfig } from './language-config';
import { TypeTranslateComponent } from '../components/type-translate/type-translate.component';
import { registerTranslateExtension } from './translate.extension';
import { TranslocoService } from '@jsverse/transloco';

export const NgxFormlyConfig: ConfigOption = {
  types: [{ name: 'type-translate', component: TypeTranslateComponent }],
  presets: [
    {
      name: 'typeTranslate',
      config: {
        key: 'name',
        type: 'type-translate',
        fieldGroup: LanguageConfig.LanguageList.map((language) => {
          return {
            key: language,
            type: 'input',
            props: {
              label: LanguageConfig.LANGUAGES[language],
              placeholder: 'Input placeholder',
              required: true,
            },
          };
        }),
      },
    },
  ],
};

export const NgxFormlyProviders = [
  // https://formly.dev/docs/examples/advanced/i18n-alternative/
  {
    provide: FORMLY_CONFIG,
    multi: true,
    useFactory: registerTranslateExtension,
    deps: [TranslocoService],
  },
];
