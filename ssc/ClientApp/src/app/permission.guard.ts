import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root'
})

export class PermissionGuard implements CanActivate {

    constructor(
        private router: Router,
        private permissionService: PermissionService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var res:boolean = this.permissionService.passPermission(state.url);
        if(!res) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        }
        return res;
    }
}
