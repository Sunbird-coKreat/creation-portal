
import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
// import * as moment from 'moment';
import * as _ from 'lodash-es';
import { ServerResponse } from '../../interfaces/serverResponse';
import { RequestParam } from '../../interfaces/requestParam';
import { HttpOptions } from '../../interfaces/httpOptions';

/**
 * Service to provide base CRUD methods to make api request.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {
  /**
   * Contains rootOrg Id
   */
  rootOrgId: string;
  /**
   * Contains channel Id
   */
  channelId: string;
   /**
    * Contains appId
    */
  appId: string;
  /**
   * Contains devoce Id
   */
  deviceId: string;
  /**
   * Contains base Url for api end points
   */
  baseUrl = 'api/';
  /**
   * angular HttpClient
   */
  http: HttpClient;
  /**
   * Constructor
   * @param HttpClient http HttpClient reference
   */
  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * for making get api calls which needs headers in response
   *  headers are fetched to get server time using Date attribute in header
   * @param requestParam interface
   */
  getWithHeaders(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param,
      observe: 'response'
    };

    return this.http.get(this.baseUrl + requestParam.url, httpOptions).pipe(
      mergeMap(({body, headers}: any) => {
        // replace ts time with header date , this value is used in telemetry
        body.ts =  this.getDateDiff((headers.get('Date')));
        if (body.responseCode !== 'OK') {
          return observableThrowError(body);
        }
        return observableOf(body);
      }));
  }

  /**
   * for making get api calls
   *
   * @param requestParam interface
   */
  get(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };

    return this.http.get(this.baseUrl + requestParam.url, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));

  }

  /**
   * for making post api calls with headers in response object
   *
   * @param RequestParam requestParam interface
   *
   */
  postWithHeaders(requestParam: RequestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param,
      observe: 'response'
    };

    return this.http.post(this.baseUrl + requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap(({body, headers}: any) => {
        // replace ts time with header date , this value is used in telemetry
        body.ts =  this.getDateDiff((headers.get('Date')));
        if (body.responseCode !== 'OK') {
          return observableThrowError(body);
        }
        return observableOf(body);
      }));
  }

  /**
   * for making post api calls
   * @param RequestParam requestParam interface
   */
  post(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };

    return this.http.post(this.baseUrl + requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }

  /**
   * for making patch api calls
   *
   * @param RequestParam requestParam interface
   *
   */
  patch(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };

    return this.http.patch(this.baseUrl + requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }

  /**
   * for making delete api calls
   * @param RequestParam requestParam interface
   */
  delete(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param,
      body: requestParam.data
    };
    return this.http.delete(this.baseUrl + requestParam.url, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }

  /**
   * for preparing headers
   */
  private getHeader(headers?: HttpOptions['headers']): HttpOptions['headers'] {
    // tslint:disable-next-line:variable-name
    const default_headers = {
      Accept: 'application/json',
      // 'X-Consumer-ID': 'X-Consumer-ID',
      'X-Source': 'web',
      ts: '2020-12-31T16:23:27+05:30', // moment().format(), //TODO::
      'X-msgid': UUID.UUID(),
      // tslint:disable-next-line:max-line-length
      Authorization: ''
    };

    try {
      this.deviceId = (document.getElementById('deviceId') as HTMLInputElement).value || '9d1588c3cbc765c334ccc565e53d81a8';
      this.appId = (document.getElementById('appId') as HTMLInputElement).value || 'dev.dock.portal';
    } catch (err) { }
    if (this.deviceId) {
      default_headers['X-Device-ID'] = this.deviceId;
    }
    if (this.rootOrgId) {
      default_headers['X-Org-code'] = this.rootOrgId;
    }
    if (this.channelId) {
      default_headers['X-Channel-Id'] = this.channelId;
    }
    if (this.appId) {
      default_headers['X-App-Id'] = this.appId;
    }
    if (headers) {
      return { ...default_headers, ...headers };
    } else {
      return { ...default_headers };
    }
  }

  private getDateDiff(serverdate): number {
    const currentdate: any = new Date();
    const serverDate: any = new Date(serverdate);
    if (serverdate) {
      return ( serverDate - currentdate ) / 1000;
    } else {
      return 0;
    }
  }
}
