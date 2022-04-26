import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { PePermissionService } from './pe-permission.service';

@Injectable({
  providedIn: 'root'
})

export class PePermissionGuard implements CanActivate {

    constructor(
        private router: Router,
        private pePermissionService: PePermissionService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var res:boolean = this.pePermissionService.passPermission(state.url);
        if(!res) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        }
        return res;
    }
}