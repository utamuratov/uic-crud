import { TranslocoService } from '@jsverse/transloco';
import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';

// https://formly.dev/docs/examples/advanced/i18n-alternative/
export class TranslateExtension implements FormlyExtension {
  constructor(private translate: TranslocoService) {}
  prePopulate(field: FormlyFieldConfig) {
    const props = field.props || {};
    if (!props['translate'] || props['_translated']) {
      return;
    }
    props['_translated'] = true;

    field.expressions = {
      ...(field.expressions || {}),
      'props.label': this.translate.selectTranslate(props.label || ''),
    };
  }
}
export function registerTranslateExtension(translate: TranslocoService) {
  return {
    validationMessages: [
      {
        name: 'required',
        message() {
          return translate.selectTranslate('form.validation.required');
        },
      },
    ],
    extensions: [
      { name: 'translate', extension: new TranslateExtension(translate) },
    ],
  };
}
