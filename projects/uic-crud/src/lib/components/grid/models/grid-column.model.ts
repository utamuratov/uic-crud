import { LanguageConfig } from '../../../utils/language-config';

type TypeTemplate = 'translate';

export interface IGridColumn {
  field: string;
  colspan?: number | null;
  rowspan?: number | null;
  headerName?: string;
  sortable?: boolean | null;
  i18n?: boolean;
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
    public i18n?: boolean,
    public template?: TypeTemplate,
    public children?: GridColumn[]
  ) {
    if (i18n) {
      this.children = LanguageConfig.LanguageList.map((x) =>
        gridColumnFactory({
          field: `${field}.${x}`,
          headerName: LanguageConfig.LANGUAGES[x],
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
  i18n,
  template,
  children,
}: IGridColumn): GridColumn {
  return new GridColumn(
    field,
    colspan,
    rowspan,
    sortable,
    headerName,
    i18n,
    template,
    children
  );
}
