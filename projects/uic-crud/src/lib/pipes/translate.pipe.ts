import { Inject, Pipe, inject, type PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { DITokens, ILanguageConfig } from '../utils/di.tokens';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private $transloco = inject(TranslocoService);

  constructor(
    @Inject(DITokens.LANGUAGE_CONFIG) private languageConfig: ILanguageConfig
  ) {}

  transform(value: typeof this.languageConfig.languages): string {
    return value[this.$transloco.getActiveLang()];
  }
}
