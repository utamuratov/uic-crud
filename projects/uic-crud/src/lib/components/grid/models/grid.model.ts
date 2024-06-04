export interface GridModel<T = any> {
  pageIndex: number;
  pageSize: number;
  total: number;
  items: T[];
}
