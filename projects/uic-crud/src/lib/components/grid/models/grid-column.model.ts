import { ILanguageConfig } from '../../../utils/di.tokens';
import { gridColumnFactory } from '../services/column.service';

type TypeTemplate = 'translate';

export interface IGridColumn<TLanguages = ILanguageConfig['languages']> {
  field: string;
  colspan?: number | null;
  rowspan?: number | null;
  headerName?: string;
  sortable?: boolean | null;
  languages?: TLanguages;
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
    public languages?: ILanguageConfig['languages'],
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
