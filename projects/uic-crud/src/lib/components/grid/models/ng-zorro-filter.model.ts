export interface ZorroFilterRequest {
  pageIndex: number;
  pageSize: number;
  sort?: ZorroSort[] | undefined;
  filter?: ZorroFilter[] | undefined;
}

export interface ZorroSort {
  key: string;
  value: ZorroSortEnum;
}

export enum ZorroSortEnum {
  Asc = 0,
  Desc = 1,
}

export interface ZorroFilter {
  key: string;
  value: any;
}
