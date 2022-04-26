import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';
//import { User } from '../user';

@Injectable({
	providedIn: 'root'
})

export class SscPermissionService {
	
	private currentUser: any;
	private state: RouterStateSnapshot;
	private basePath: string = "ssc";

	private root: Menu[] = [

	new Menu("dashboard", true, ["IctDashboard Read"]),

	new Menu("ticket", true, ["IctTickets Read"]),
	new Menu("ticket/list", true, ["IctTickets Read"]),

	new Menu("sla", true, ["IctSla Read"]),
	new Menu("sla/month", true, ["IctSla Read"]),
	
	];
	
	constructor(
		private router: Router,
		private authService: AuthService,
		) { 
		this.authService.currentUser.subscribe(res => this.currentUser = res);
	}

	passPermission(path:String) {
        var res:boolean = false;
        var ms:Menu[] = this.root.filter(m => path.indexOf(this.basePath+'/'+m.link) != -1);
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