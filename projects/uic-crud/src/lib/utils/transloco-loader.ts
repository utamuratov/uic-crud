import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { TranslocoLoader } from '@jsverse/transloco';
import { DITokens } from './di.tokens';
import { LanguageEnum } from './language-config';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  constructor(@Inject(DITokens.API_BASE_URL) private baseUrl: string) {}

  getTranslation(lang: LanguageEnum) {
    return this.http.get(
      `${this.baseUrl}/api/reference/InterfaceTranslate/GetAllDictionary/${lang}`
    );
  }
}
