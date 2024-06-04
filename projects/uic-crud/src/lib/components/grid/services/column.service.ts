import { Inject, Injectable } from '@angular/core';
import { DITokens, ILanguageConfig } from '../../../utils/di.tokens';
import { GridColumn, IGridColumn } from '../models/grid-column.model';

@Injectable({ providedIn: 'root' })
export class GridColumnService {
  constructor(
    @Inject(DITokens.LANGUAGE_CONFIG) private languageConfig: ILanguageConfig
  ) {}

  columnFactory({
    field,
    colspan,
    rowspan,
    headerName,
    sortable,
    languages,
    template,
    children,
  }: IGridColumn<boolean>): GridColumn {
    return gridColumnFactory({
      field,
      colspan,
      rowspan,
      sortable,
      headerName,
      languages: languages ? this.languageConfig.languages : undefined,
      template,
      children,
    });
  }
}

export function gridColumnFactory({
  field,
  colspan,
  rowspan,
  headerName,
  sortable,
  languages,
  template,
  children,
}: IGridColumn): GridColumn {
  return new GridColumn(
    field,
    colspan,
    rowspan,
    sortable,
    headerName,
    languages,
    template,
    children
  );
}
