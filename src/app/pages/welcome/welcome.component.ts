import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  GridComponent,
  GridColumn,
  gridColumnFactory,
  CRUDService,
} from 'uic-crud';
import { CountryApiService } from './services/country-api.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [GridComponent],
  providers: [
    {
      provide: CRUDService,
      useClass: CountryApiService,
    },
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {
  readonly header = { title: 'countries', showAddButton: true };

  readonly columns: GridColumn[] = [
    gridColumnFactory({
      field: 'id',
      sortable: true,
    }),
    gridColumnFactory({
      field: 'name',
      i18n: true,
    }),
    gridColumnFactory({
      field: 'code',
      sortable: true,
    }),
    gridColumnFactory({
      field: 'numeral',
      headerName: 'order',
      sortable: true,
    }),
  ];

  readonly fields: FormlyFieldConfig[] = [
    {
      type: '#typeTranslate',
    },
    {
      fieldGroupClassName: 'flex gap-2',
      fieldGroup: [
        {
          key: 'numeral',
          type: 'number',
          className: 'w-24',
          props: {
            translate: true,
            label: 'order',
            required: true,
          },
        },
        {
          key: 'code',
          type: 'input',
          className: 'w-28',
          props: {
            translate: true,
            label: 'code',
            required: true,
          },
        },
      ],
    },
  ];
}
