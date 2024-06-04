import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ModalData } from '../grid/models/modal-data.model';
import { CRUDService } from '../grid/services/crud.service';

@Component({
  selector: 'app-add-edit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    FormlyNgZorroAntdModule,
    FormlyModule,

    NzFormModule,
  ],
  template: `
    <form
      nz-form
      [nzLayout]="'vertical'"
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
    >
      <formly-form [form]="form" [model]="model" [fields]="fields">
      </formly-form>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditModalComponent {
  private $data = inject(CRUDService);
  readonly $modalRef = inject(NzModalRef);

  form = new UntypedFormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [];

  readonly nzModalData: ModalData = inject(NZ_MODAL_DATA);

  /**
   *
   */
  constructor() {
    console.log('this.nzModalData', this.nzModalData);
    if (this.nzModalData.editingData) this.model = this.nzModalData.editingData;
    this.fields = this.nzModalData.fields;
  }

  onSubmit() {
    if (this.form.valid) {
      const request = this.form.getRawValue();

      // UPDATE
      if (this.nzModalData.editingData) {
        request.id = this.nzModalData.editingData.id;
        this.$data.update(request).subscribe((response) => {
          console.log(response);
          if (!response.error) {
            this.$modalRef.close(request);
          }
        });

        return;
      }

      // CREATE
      this.$data.create(request).subscribe((response) => {
        console.log(response);
        if (!response.error) {
          this.$modalRef.close(response.result);
        }
      });
    }
  }
}
