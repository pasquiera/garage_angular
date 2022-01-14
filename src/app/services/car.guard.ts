import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CarService } from './car.service';

@Injectable({
  providedIn: 'root'
})
export class CarGuard implements CanActivate {

  constructor(private auth: AuthService, private car: CarService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Observable<boolean>(obs => {
      let id = route.params['id'];
      if (this.auth.isLoggedIn) {
        this.car.getCar(id).pipe(first()).subscribe(data => {
          if (data.owner == this.auth.userID) {
            console.log(this.auth.userID)
            console.log(data.owner)
            obs.next(true);
          }
          else {
            this.router.navigate(['/auctions']);
            obs.next(false);
          }
        }
        );
      } else {
        this.router.navigate(['/auctions']);
        obs.next(false);
      }
    });

  }
}
