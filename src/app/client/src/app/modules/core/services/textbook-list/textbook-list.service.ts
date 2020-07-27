import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TextbookListService {

  constructor( private httpClient: HttpClient) { }

  getTextbookList(url, data) {
    return this.httpClient.post<any>(url, data);
  }


}
