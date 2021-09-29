import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AzureFileUploaderService {

  maxBlockSize;
  numberOfBlocks = 1;
  selectedFile = null;
  currentFilePointer = 0;
  totalBytesRemaining = 0;
  blockIds = [];
  blockIdPrefix = 'block-';
  submitUri = null;
  bytesUploaded = 0;
  signedURL = '';
  azurObserver;
  fileReqBlocks = [];
  timeStarted;
  remainingTime = '';
  reader = new FileReader();
  constructor(
    private httpClient: HttpClient
  ) { }


  uploadToBlob(signedURL: string, file) {
    this.signedURL = signedURL;
    this.selectedFile = file;
    return new Observable((observer) => {
      this.azurObserver = observer;
      this.handleFileSelect();
    });
  }

  handleFileSelect() {
    this.fileReqBlocks = [];
    this.currentFilePointer = 0;
    this.totalBytesRemaining = 0;
    this.bytesUploaded = 0;
    this.maxBlockSize = 5 * 1024 * 1024; // Each file will be split in 50 MB.
    this.blockIds = [];
    const fileSize = this.selectedFile.size;
    console.log('fileSize::::', fileSize);
    if (fileSize < this.maxBlockSize) {
      this.maxBlockSize = fileSize;
      console.log('max block size = ' + this.maxBlockSize);
    }
    this.totalBytesRemaining = fileSize;
    this.timeStarted = new Date().getTime();
    if (fileSize % this.maxBlockSize === 0) {
      this.numberOfBlocks = fileSize / this.maxBlockSize;
    } else {
      this.numberOfBlocks = _.parseInt(fileSize / this.maxBlockSize) + 1;
    }
    console.log('total blocks = ' + this.numberOfBlocks);
    const indexOfQueryStart = this.signedURL.indexOf('?');
    this.submitUri = this.signedURL.substring(0, indexOfQueryStart) + this.signedURL.substring(indexOfQueryStart);
    this.uploadFileInBlocks();
  }

  uploadFileInBlocks() {

    if (this.totalBytesRemaining > 0) {
      console.log('current file pointer = ' + this.currentFilePointer + ' bytes read = ' + this.maxBlockSize);
      const fileContent = this.selectedFile.slice(this.currentFilePointer, this.currentFilePointer + this.maxBlockSize);
      const blockId = this.blockIdPrefix + this.pad(this.blockIds.length, 6);
      console.log('block id = ' + blockId);
      this.blockIds.push(btoa(blockId));
      this.commitBlock(fileContent);
      this.currentFilePointer += this.maxBlockSize;
      this.totalBytesRemaining -= this.maxBlockSize;
      console.log('totalBytesRemaining :: ', this.totalBytesRemaining);
      if (this.totalBytesRemaining < this.maxBlockSize) {
        this.maxBlockSize = this.totalBytesRemaining;
        console.log('this.maxBlockSize :: ', this.maxBlockSize);
      }
    } else {
      console.log('createBlocks::::');
      this.createBlocks().then((data: any) => {
          this.commitBlockList();
      }).catch(err => {
        this.abortUpload(err);
      });
    }
  }

  abortUpload(err?) {
    if (this.fileReqBlocks.length > 0) {
      _.forEach(this.fileReqBlocks, data => data.controller.abort());
      this.azurObserver.error(err);
    }
  }

  handleUploadedData(data) {
    this.bytesUploaded += data.requestData.length;
    const percentComplete = ((parseFloat(_.toNumber(this.bytesUploaded)) / parseFloat(this.selectedFile.size)) * 100).toFixed(2);
    console.log(percentComplete + ' %');
    this.fileUploadingTimeCalculation();
    this.azurObserver.next({percentComplete: percentComplete, remainingTime: this.remainingTime});
  }

  createBlocks() {
    return new Promise((resolve, reject) => {
      const initialCall = _.first(this.fileReqBlocks);
      const laterCall = _.chunk(_.tail(this.fileReqBlocks), 2);
      const requests = _.map([[initialCall], ...laterCall], (reqBatch, index) =>
        forkJoin(
          reqBatch.map(data => {
            return this.addBlock(data.uri, data.requestData, data.controller).pipe(tap(res => {
              this.handleUploadedData(data);
            }), catchError(err => throwError(err)));
          })
        ).pipe(tap(v => {
          if ((index + 1) < requests.length) {
            requests[index + 1].subscribe(result => {}, err => reject(err));
          } else {
            resolve('done');
          }
        }), catchError(err => throwError(err)))
      );
      requests[0].subscribe(result => {}, err => reject(err));
    });
  }

  commitBlock(fileContent) {
    this.reader.onloadend =  ((evt: any) => {
      if (evt.target.readyState === FileReader.DONE) {
        const uri = this.submitUri + '&comp=block&blockid=' + this.blockIds[this.blockIds.length - 1];
        const requestData = new Uint8Array(evt.target.result);
        const controller = new AbortController();
        // const signal = controller.signal;
        this.fileReqBlocks.push({uri, requestData, controller});
        this.uploadFileInBlocks();
      }
    });
    this.reader.readAsArrayBuffer(fileContent);
  }

  commitBlockList() {
    const uri = this.submitUri + '&comp=blocklist';
    console.log('commitBlockList :: ', uri);
    let requestBody = '<?xml version="1.0" encoding="utf-8"?><BlockList>';
    for (let i = 0; i < this.blockIds.length; i++) {
      requestBody += '<Latest>' + this.blockIds[i] + '</Latest>';
    }
    requestBody += '</BlockList>';
    console.log('commitBlockList ::' , requestBody);

    this.addBlockList(uri, requestBody).subscribe((event) => {
      this.azurObserver.next('completed');
      this.azurObserver.complete();
    }, (error) => {
      console.log(error);
      this.azurObserver.error(error);
    });
  }

  addBlockList (uri: string, requestData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-ms-blob-content-type': this.selectedFile.type
      })
    };
    return this.httpClient.put<any>(uri, requestData, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  addBlock (uri: string, requestData: any, controller: any): Observable<any> {

    return new Observable((observer) => {
      const fetchPromise = fetch(uri, {
        'headers': {
          'Content-Type': 'video/mp4',
          'x-ms-blob-type': 'BlockBlob'
        },
        'body': requestData,
        'method': 'PUT',
        'signal': controller.signal
      });
      fetchPromise.then((value) => {
        if (value.ok) {
          observer.next();
          observer.complete();
        } else {
          console.log('addBlock::ERROR');
          observer.error(value.statusText);
        }
      }, (err) => {
        console.log('addBlock::ERROR');
        observer.error(err);
      });
   });

  }

  fileUploadingTimeCalculation() {
    const timeElapsed = (new Date().getTime()) - this.timeStarted;
    const uploadSpeed = Math.floor(this.bytesUploaded / (timeElapsed / 1000)); // Upload speed in second
    const estimatedSecondsLeft = Math.round(((this.selectedFile.size - this.bytesUploaded) / uploadSpeed));
    if (!estimatedSecondsLeft) {
        return;
    }
    this.countdownTimer(estimatedSecondsLeft, 'seconds');
  }

  countdownTimer(number, unit) {
      let m, s, h, d;
      if (isNaN(number)) {
          throw new TypeError('Value must be a number.');
      }
      if (unit === 'sec' || unit === 'seconds') {
          s = number;
      } else if (unit === 'ms' || unit === 'milliseconds' || !unit) {
          s = Math.floor(number / 1000);
      } else {
          throw new TypeError('Unit must be sec or ms');
      }
      m = Math.floor(s / 60);
      s = s % 60;
      h = Math.floor(m / 60);
      m = m % 60;
      d = Math.floor(h / 24);
      h = h % 24;

      const parts = {
            days: d,
            hours: h,
            minutes: m,
            seconds: s
      };
      const remaining = Object.keys(parts)
          .map(part => {
              if (!parts[part]) {
                return;
              }
              return `${parts[part]} ${part}`;
          })
          .join(' ');
      this.remainingTime = remaining;

  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

   pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }

}
