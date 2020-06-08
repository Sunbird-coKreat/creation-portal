import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
    this.maxBlockSize = 10 * 1024 * 1024; // Each file will be split in 50 MB.
    this.blockIds = [];
    const fileSize = this.selectedFile.size;
    console.log('fileSize::::', fileSize);
    if (fileSize < this.maxBlockSize) {
      this.maxBlockSize = fileSize;
      console.log('max block size = ' + this.maxBlockSize);
    }
    this.totalBytesRemaining = fileSize;
    if (fileSize % this.maxBlockSize === 0) {
      this.numberOfBlocks = fileSize / this.maxBlockSize;
    } else {
      this.numberOfBlocks = _.parseInt(fileSize / this.maxBlockSize) + 1;
    }
    console.log('total blocks = ' + this.numberOfBlocks);
    const indexOfQueryStart = this.signedURL.indexOf('?');
    this.submitUri = this.signedURL.substring(0, indexOfQueryStart) + this.signedURL.substring(indexOfQueryStart);
    console.log(this.submitUri);
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
      this.createBlocks().subscribe((data: any) => {
        this.commitBlockList();
      }, (err) => {
        this.azurObserver.error(err);
        this.azurObserver.complete();
      });
    }
  }

  createBlocks(): Observable<any> {
    return forkJoin(
      this.fileReqBlocks.map(data => {
        return this.addBlock(data.uri, data.requestData).pipe(map(res => {
            this.bytesUploaded += data.requestData.length;
            const percentComplete = ((parseFloat(_.toNumber(this.bytesUploaded)) / parseFloat(this.selectedFile.size)) * 100).toFixed(2);
            console.log(percentComplete + ' %');
            this.azurObserver.next({percentComplete});
            return res;
        }));
      })
    );
  }

  commitBlock(fileContent) {
    this.reader.onloadend =  ((evt: any) => {
      if (evt.target.readyState === FileReader.DONE) {
        const uri = this.submitUri + '&comp=block&blockid=' + this.blockIds[this.blockIds.length - 1];
        const requestData = new Uint8Array(evt.target.result);
        this.fileReqBlocks.push({uri, requestData});
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

  addBlock (uri: string, requestData: any): Observable<any> {

    return new Observable((observer) => {
      const fetchPromise = fetch(uri, {
        'headers': {
          'Content-Type': 'video/mp4',
          'x-ms-blob-type': 'BlockBlob'
        },
        'body': requestData,
        'method': 'PUT',
      });
      fetchPromise.then((value) => {
        observer.next();
        observer.complete();
      }, (err) => {
        console.log('addBlock::ERROR');
        observer.error(err);
        observer.complete();
      });
   });

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'content-type': 'video/mp4',
    //     'x-ms-blob-type': 'BlockBlob'
    //   })
    // };
    // return this.httpClient.put<any>(uri, requestData, httpOptions)
    //   .pipe(
    //     catchError(this.handleError)
    //   );

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
