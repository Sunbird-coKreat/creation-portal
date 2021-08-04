import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicDataService extends DataService {

  /**
   * base Url for public api
   */
  baseUrl: string;

  public http: HttpClient;
  constructor(http: HttpClient) {
    super(http);
    this.baseUrl = 'action/';
  }
}
