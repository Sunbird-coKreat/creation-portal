import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { iif, Observable, of } from 'rxjs';
import { DataService } from '../data/data.service';
import { UserService } from '../user/user.service';
// import { ResourceService, ToasterService } from 'src/app/modules/shared';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService extends DataService implements CanActivate {
  constructor(private userService: UserService,
    // private toasterService: ToasterService,
    // private resourceService: ResourceService,
    private router: Router,
    http: HttpClient) {
    super(http);
  }

  /**
 * auth guard to prevent unauthorized access to the route
 */
  canActivate(): Observable<boolean> {
    return iif(() => !this.userService.loggedIn, of(false), of(true).pipe(
      tap(allow => {
        if (!allow) {
          // this.toasterService.warning(this.resourceService.messages.imsg.m0035);
          this.router.navigate(['learn']);
        }
      })
    )
    );
  }
}
