import { Injectable } from '@angular/core';
import { CsModule } from '@project-sunbird/client-services';
import { CsClientStorage } from '@project-sunbird/client-services/core/cs-client-storage';
import { UserService } from '@sunbird/core';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CsLibInitializerService {
  fingerprintInfo = '';

  constructor(public userService: UserService) { }

  private _initializeCs() {
    this.fingerprintInfo = (<HTMLInputElement>document.getElementById('deviceId')).value;
    if (!CsModule.instance.isInitialised) {
       // Singleton initialised or not
        CsModule.instance.init({
          core: {
              httpAdapter: 'HttpClientBrowserAdapter',
              global: {
                  channelId: this.userService.hashTagId, // required
                  producerId: this.userService.appId, // required
                  deviceId: this.fingerprintInfo // required
              },
              api: {
                  host: document.location.origin, // default host
                  authentication: {
                  // userToken: string; // optional
                  // bearerToken: string; // optional
              }
            }
          },
          services: {
              contentServiceConfig: {
                hierarchyApiPath: '/learner/questionset/v2',
                questionListApiPath: '/api/question/v2'
              }
          }
      },
      null,
      new class implements CsClientStorage {
        setItem(key: string, value: string): Promise<void> {
          return new Promise(resolve => {
            resolve(localStorage.setItem(key, value));
          });
        }
        getItem(key: string): Promise<string | undefined> {
          return new Promise(resolve => {
            const value = localStorage.getItem(key);
            console.log('localStorage.getItem(key)', value);
            resolve(value);
          });
        }
    }
      );
    }
  }
  initializeCs() {
    this._initializeCs();
  }
}
