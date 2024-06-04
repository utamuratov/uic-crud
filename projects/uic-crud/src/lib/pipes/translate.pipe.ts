import { Pipe, inject, type PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { TypeLanguage, TypeLanguageKeys } from '../utils/language-config';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private $transloco = inject(TranslocoService);

  transform(value: TypeLanguage): string {
    return value[this.$transloco.getActiveLang() as TypeLanguageKeys];
  }
}
