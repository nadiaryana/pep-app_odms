import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { SscPermissionService } from './ssc-permission.service';

@Injectable({
  providedIn: 'root'
})

export class SscPermissionGuard implements CanActivate {

    constructor(
        private router: Router,
        private sscPermissionService: SscPermissionService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var res:boolean = this.sscPermissionService.passPermission(state.url);
        if(!res) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        }
        return res;
    }
}