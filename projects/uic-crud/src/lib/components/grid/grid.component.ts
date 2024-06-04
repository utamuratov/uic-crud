import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { AddEditModalComponent } from '../add-edit-modal/add-edit-modal.component';
import { GridColumn } from './models/grid-column.model';
import { GridQueryParams } from './models/grid-query.model';
import { GridModel } from './models/grid.model';
import { ModalData } from './models/modal-data.model';
import { GetDeepValuePipe } from './pipes/getDeepValue.pipe';
import { CRUDService } from './services/crud.service';
import { DeepCopy } from '../../utils/deep-clone';
import { ZorroFilterRequest } from './models/ng-zorro-filter.model';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    TranslocoPipe,
    NzIconModule,
    NzTableModule,
    NzButtonModule,
    NzPopconfirmModule,

    GetDeepValuePipe,
    TranslatePipe,
  ],
  providers: [NzModalService],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  @Input()
  queryParams: GridQueryParams = {
    pageIndex: 1,
    pageSize: 10,
  };

  private _columns!: GridColumn[];
  public get columns(): GridColumn[] {
    return this._columns;
  }
  @Input({ required: true })
  public set columns(v: GridColumn[]) {
    this._columns = v;
    this.calcRowsCount(1, v);
    this.makeThead(v, 1);
  }

  /**
   * Width configuration for each column
   * e.g. ['100px', '200px', '300px']
   */
  @Input()
  nzWidthConfig: string[] = [];

  @Input()
  showActions = true;

  @Input({ required: true })
  formlyFieldConfigs!: FormlyFieldConfig[];

  @Input()
  header?: { title: string; showAddButton: boolean };

  private $cdr = inject(ChangeDetectorRef);
  private $data = inject(CRUDService);
  private $modal = inject(NzModalService);
  private $viewContainerRef = inject(ViewContainerRef);
  private $transloco = inject(TranslocoService);

  loading = false;
  data: GridModel = {
    items: [],
    total: 0,
    pageSize: this.queryParams.pageSize,
    pageIndex: this.queryParams.pageIndex,
  };
  thead: Array<GridColumn[]> = [];
  columnsWithValue: GridColumn[] = [];
  private maxRows = 0;

  private calcRowsCount(currentRow: number, columns?: GridColumn[]) {
    if (columns) {
      for (const c of columns) {
        this.calcRowsCount(currentRow + 1, c.children);
      }
      return;
    }

    if (currentRow > this.maxRows) {
      this.maxRows = currentRow - 1;
    }
  }

  private makeThead(columns: GridColumn[], currentRow: number) {
    for (const c of columns) {
      const rowspan = this.maxRows - currentRow + 1;
      this.thead[currentRow - 1] = [
        ...(this.thead[currentRow - 1] || []),
        {
          ...c,
          colspan: c.children?.length || null,
          rowspan: rowspan > 1 && !c.children ? rowspan : null,
        },
      ];

      if (!c.children) {
        this.columnsWithValue.push(c);
      } else {
        this.makeThead(c.children, currentRow + 1);
      }
    }
  }

  private loadDataFromServer(
    { pageIndex, pageSize, sort, filter }: GridQueryParams = this.queryParams
  ): void {
    this.loading = true;

    this.$data
      .getAll({
        pageIndex: pageIndex - 1,
        pageSize,
        filter: filter,
        sort: sort
          ? sort.map((x) => ({
              key: x.key,
              value: x.value === 'ascend' ? 0 : 1,
            }))
          : undefined,
      } satisfies ZorroFilterRequest)
      .subscribe((data) => {
        if (data.result) {
          this.data = data.result;
        }
        this.$cdr.markForCheck();
        this.loading = false;
      });
  }

  private openModal(data?: any) {
    const modal = this.$modal.create<AddEditModalComponent, ModalData>({
      nzTitle: this.$transloco.translate(data ? 'edit' : 'add'),
      nzContent: AddEditModalComponent,
      nzViewContainerRef: this.$viewContainerRef,
      nzData: {
        editingData: data,
        fields: DeepCopy.copy(this.formlyFieldConfigs),
      },
      nzFooter: [
        {
          label: this.$transloco.translate('save'),
          type: 'primary',
          onClick: (componentInstance: AddEditModalComponent) => {
            console.log('Submit');
            componentInstance.onSubmit();
          },
        },
        {
          label: this.$transloco.translate('cancel'),
          onClick: () => modal.destroy(),
        },
      ] as any,
    });
    const instance = modal.getContentComponent();
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // Return a result when closed
    modal.afterClose.subscribe((result) => {
      console.log('close', this.data);

      if (result) {
        this.loadDataFromServer();
        this.$cdr.markForCheck();
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.queryParams.pageSize = pageSize;
    this.queryParams.pageIndex = pageIndex;
    this.queryParams.sort = sortField
      ? [
          {
            key: sortField,
            value: sortOrder,
          },
        ]
      : undefined;
    this.queryParams.filter = filter;

    this.loadDataFromServer(this.queryParams);
  }

  add() {
    this.openModal();
  }

  edit(data: any) {
    this.openModal(data);
  }

  confirmDelete(data: any) {
    this.$data.delete(data.id).subscribe((w) => {
      if (!w.error) {
        this.loadDataFromServer();
        this.$cdr.markForCheck();
      }
    });
  }
}
