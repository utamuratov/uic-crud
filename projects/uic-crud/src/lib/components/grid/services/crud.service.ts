import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ZorroFilterRequest } from '../models/ng-zorro-filter.model';

@Injectable()
export class CRUDService {
  getAll(zorroFilterRequest: ZorroFilterRequest) {
    return of({} as any);
  }

  delete(id?: number) {
    return of({} as any);
  }

  update(data: any) {
    return of({} as any);
  }

  create(data: any) {
    return of({} as any);
  }
}
