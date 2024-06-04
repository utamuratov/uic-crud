import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  GridComponent,
  GridColumn,
  CRUDService,
  GridColumnService,
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
  private $gridColumn = inject(GridColumnService);

  readonly columns: GridColumn[] = [
    this.$gridColumn.columnFactory({
      field: 'id',
      sortable: true,
    }),
    this.$gridColumn.columnFactory({
      field: 'name',
      languages: true,
    }),
    this.$gridColumn.columnFactory({
      field: 'code',
      sortable: true,
    }),
    this.$gridColumn.columnFactory({
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
