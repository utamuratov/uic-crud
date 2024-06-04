import { ILanguageConfig } from '../../../utils/di.tokens';

type TypeTemplate = 'translate';

export interface IGridColumn {
  field: string;
  colspan?: number | null;
  rowspan?: number | null;
  headerName?: string;
  sortable?: boolean | null;
  languages?: ILanguageConfig['languages'];
  template?: TypeTemplate;
  children?: GridColumn[];
}

export class GridColumn implements IGridColumn {
  constructor(
    public field: string,
    public colspan: number | null = null,
    public rowspan: number | null = null,
    public sortable: boolean | null = false,
    public headerName?: string,
    languages?: ILanguageConfig['languages'],
    public template?: TypeTemplate,
    public children?: GridColumn[]
  ) {
    if (languages) {
      this.children = Object.keys(languages).map((x) =>
        gridColumnFactory({
          field: `${field}.${x}`,
          headerName: languages[x],
        })
      );
    }
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
