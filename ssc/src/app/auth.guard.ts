import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  private currentUser: User;
	
    constructor(
        private router: Router,
        private authService: AuthService,
    ) {
		this.authService.currentUser.subscribe(res => this.currentUser = res);
	}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       //console.log(route);
        //const currentUser = this.authenticationService.currentUserValue;
        if (this.currentUser != null) {
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
        
    }
}
