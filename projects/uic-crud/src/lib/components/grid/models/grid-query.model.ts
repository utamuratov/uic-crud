import { NzTableQueryParams } from 'ng-zorro-antd/table';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type GridQueryParams = Optional<NzTableQueryParams, 'sort' | 'filter'>;
