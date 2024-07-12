import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { CRUDService, DITokens, ZorroFilterRequest } from 'uic-crud';

@Injectable({
  providedIn: 'root',
})
export class CountryApiService implements CRUDService {
  private http: HttpClient;
  private baseUrl: string;

  constructor(
    @Inject(HttpClient) http: HttpClient,
    @Optional() @Inject(DITokens.API_BASE_URL) baseUrl?: string
  ) {
    this.http = http;
    this.baseUrl = baseUrl ?? '';
  }

  getById(countryId?: number | undefined) {
    return this.http.get(
      this.baseUrl +
        '/api/admin/reference/Country/GetById?countryId=' +
        countryId
    );
  }

  getAll(zorroFilterRequest: ZorroFilterRequest) {
    return this.http.post(
      this.baseUrl + '/api/admin/reference/Country/GetAll',
      zorroFilterRequest
    );
  }

  create(countryDTO: any) {
    return this.http.post(
      this.baseUrl + '/api/admin/reference/Country/Create',
      countryDTO
    );
  }

  update(countryDTO: any) {
    return this.http.put(
      this.baseUrl + '/api/admin/reference/Country/Update',
      countryDTO
    );
  }

  delete(countryId?: number | undefined) {
    return this.http.delete(
      this.baseUrl +
        '/api/admin/reference/Country/Delete?countryId=' +
        countryId
    );
  }
}
