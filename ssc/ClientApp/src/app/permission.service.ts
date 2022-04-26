import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { AuthService } from './auth.service';
//import { User } from './user';

@Injectable({
	providedIn: 'root'
})

export class PermissionService {
	
	private currentUser: any;
	private state: RouterStateSnapshot;

	private root: Menu[] = [
	new Menu("", false),
	new Menu("dashboard", true),
	new Menu("employee", true, ["Employee Read"]),
	new Menu("enum", true, ["Enum Read"]),
	new Menu("location", true, ["Location Read"]),
	new Menu("location/list", true, ["Location Read"]),
	new Menu("location/add", true, ["Location Add"]),
	new Menu("logout", true),
	];
	
	constructor(
		private router: Router,
		private authService: AuthService,
		) { 
		this.authService.currentUser.subscribe(res => this.currentUser = res);
	}

	passPermission(path:String) {
        var res:boolean;
        var ms:Menu[] = this.root.filter(m => m.link == path.replace(/^\/|\/$/g, ''));
        if(ms.length > 0) {
            var menu:Menu = ms[0];
            if (this.currentUser != null) {
                if (menu.permission.length == 0) {
                    res = true;
                } else {
                    for(var p=0; p<menu.permission.length; p++) {
                        if(this.currentUser.Permission.indexOf(menu.permission[p]) != -1) {
                            res = true;
                        }
                    }
                }
            } else {
                res = !menu.auth;
            }
        }
        return res;
    }

}

export class Menu {
	constructor(
		public link: string,
		public auth: boolean,
		public permission: string[] = []
		) {}
}