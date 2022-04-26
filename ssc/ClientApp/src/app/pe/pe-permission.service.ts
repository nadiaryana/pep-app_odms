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

export class PePermissionService {
	
	private currentUser: any;
	private state: RouterStateSnapshot;
	private basePath: string = "pe";

	private root: Menu[] = [

	new Menu("dashboard", true, ["PeDashboard Read"]),
	new Menu("activewells", true, ["PeActiveWells Read"]),

	new Menu("daily", true, ["PeDaily Read"]),
	new Menu("daily/list", true, ["PeDaily Read"]),
	new Menu("daily/add", true, ["PeDaily Add"]),
	new Menu("daily/edit", true, ["PeDaily Edit"]),
	new Menu("daily/delete", true, ["PeDaily Delete"]),
	new Menu("daily/chart", true, ["PeDaily Read"]),

	new Menu("sonolog", true, ["PeSonolog Read"]),
	new Menu("sonolog/list", true, ["PeSonolog Read"]),
	new Menu("sonolog/add", true, ["PeSonolog Add"]),
	new Menu("sonolog/edit", true, ["PeSonolog Edit"]),
	new Menu("sonolog/delete", true, ["PeSonolog Delete"]),

	new Menu("sensor", true, ["PeSensor Read"]),
	new Menu("sensor/list", true, ["PeSensor Read"]),
	new Menu("sensor/add", true, ["PeSensor Add"]),
	new Menu("sensor/edit", true, ["PeSensor Edit"]),
	new Menu("sensor/delete", true, ["PeSensor Delete"]),

	new Menu("wellperformance", true, ["PeWellPerformance Read"]),
	new Menu("ipr", true, ["PeIPR Read"]),
	];
	
	constructor(
		private router: Router,
		private authService: AuthService,
		) { 
		this.authService.currentUser.subscribe(res => this.currentUser = res);
	}

	passPermission(path:String) {
		if(path.charAt(0) == "/") path = path.substring(1);
        var res:boolean = false;
        var ms:Menu[] = this.root.filter(m => path == this.basePath+'/'+m.link);
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