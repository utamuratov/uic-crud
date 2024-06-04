import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Inject,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  FieldGroupTypeConfig,
  FieldType,
  FormlyModule,
} from '@ngx-formly/core';
import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { catchError, of, switchMap, tap } from 'rxjs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EnumToArrayPipe } from '../grid/pipes/enum-to-array.pipe';
import { DITokens, ILanguageConfig } from '../../utils/di.tokens';

enum TranslateTechEnum {
  Google2 = 0,
  Google = 1,
  Bing = 2,
  Microsoft = 3,
  Yandex = 4,
}

@Component({
  selector: 'app-type-translate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyNzFormFieldModule,
    FormlyModule,

    NzIconModule,
    NzButtonModule,
    NzSpinModule,
    NzSelectModule,

    TranslocoPipe,
    EnumToArrayPipe,
  ],
  template: `
    <div class="flex items-center justify-between mb-2">
      <h1 class="mb-0">
        {{ 'name' | transloco }}
      </h1>

      <div class="flex gap-2">
        <button
          nz-button
          nzType="primary"
          (click)="translate($event)"
          [disabled]="!uzControlValue?.length || loading"
        >
          <span
            nz-icon
            nzType="translation"
            nzTheme="outline"
            class="cursor-pointer"
          ></span>
        </button>

        <nz-select
          [(ngModel)]="translationTechnology"
          (ngModelChange)="translate()"
          class="w-24"
          [disabled]="!uzControlValue?.length || loading"
        >
          @for (tech of TranslateTechEnum | enumToArray; track $index) {
          <nz-option [nzValue]="tech.value" [nzLabel]="tech.key"></nz-option>
          }
        </nz-select>
      </div>
    </div>

    <nz-spin nzTip="Loading..." [nzSpinning]="loading">
      <formly-group [field]="field"></formly-group>
    </nz-spin>
  `,
  styles: '@import "../../styles/base.css";',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeTranslateComponent extends FieldType<FieldGroupTypeConfig> {
  private http = inject(HttpClient);
  private $destroyRef = inject(DestroyRef);
  private $cdr = inject(ChangeDetectorRef);
  private $http = inject(HttpClient);
  private $notification = inject(NzNotificationService);

  readonly TranslateTechEnum = TranslateTechEnum;
  readonly FROM_LANGUAGE = this.languageConfig.translationFrom;
  translationTechnology = TranslateTechEnum.Yandex;
  loading = false;

  constructor(
    @Inject(DITokens.API_BASE_URL) private API_BASE_URL: string,
    @Inject(DITokens.LANGUAGE_CONFIG) private languageConfig: ILanguageConfig
  ) {
    super();
  }

  get uzControlValue() {
    return this.formControl.value[this.FROM_LANGUAGE];
  }

  translate(e?: Event) {
    e?.preventDefault();

    this.loading = true;

    this.googleTranslate$(this.uzControlValue, 'en')
      .pipe(switchMap(() => this.googleTranslate$(this.uzControlValue, 'ru')))
      .subscribe(() => {
        this.loading = false;
        this.$cdr.markForCheck();
      });
  }

  private googleTranslate$(
    text: string,
    to: keyof typeof this.languageConfig.languages
  ) {
    return this.$http
      .post(this.API_BASE_URL + '/api/Translation/TextTranslator', {
        from: 'uz',
        to,
        text,
        translationTechnology: this.translationTechnology,
      })
      .pipe(
        takeUntilDestroyed(this.$destroyRef),
        catchError((err) => {
          return of(JSON.parse(err.response));
        }),
        tap((w) => {
          const result = w.result;
          if (result) {
            this.formControl.controls[to].setValue(result.trim());
          } else {
            this.$notification.error('Error', w.error?.message ?? 'Error');
          }
        })
      );
  }

  // TODO: IMPLEMENT OR REMOVE
  // * WE MIGHT NEED TO KARAKALPAK LANGUAGE IN THE FUTURE. AND THIS METHOD WILL BE USEFUL
  private translate$(
    text: string,
    lang_to: 'eng_Latn' | 'rus_Cyrl' = 'eng_Latn'
  ) {
    return this.http
      .post('https://from-to.uz/api/v1/translate', {
        body: {
          resultCase: 'latin',
          lang_from: 'uzn_Latn',
          lang_to,
          text: text,
        },
      })
      .pipe(
        takeUntilDestroyed(this.$destroyRef),
        tap((w: any) => {
          const result = w.result;
          if (result) {
            this.formControl.controls[
              (lang_to === 'eng_Latn'
                ? 'en'
                : 'ru') as keyof typeof this.languageConfig.languages
            ].setValue(result.trim());
          }
        })
      );
  }
}
