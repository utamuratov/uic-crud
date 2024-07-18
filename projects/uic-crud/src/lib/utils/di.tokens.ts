import { InjectionToken } from '@angular/core';

export interface ILanguageConfig {
  languages: { [key: string]: string };
  defaultLanguage: string;
  translationFrom: string;
}

export class DITokens {
  public static API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
  public static API_PATH_OPEN_GOOGLE_TRANSTATE = new InjectionToken<string>(
    'API_PATH_OPEN_GOOGLE_TRANSTATE'
  );

  public static LANGUAGE_CONFIG = new InjectionToken<ILanguageConfig>(
    'LANGUAGE_CONFIG'
  );
}
