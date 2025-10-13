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

	new Menu("dashboard", true,null, ["PeDashboard Read"]),

	new Menu("daily", true,null, ["PeDaily Read"]),
	new Menu("daily/list", true, null, ["PeDaily Read"]),
	new Menu("daily/zonechart-list", true, null, ["PeDaily Read"]),
	new Menu("daily/manajemen", true, null, ["PeDaily Read"]),
	new Menu("daily/add", true, null, ["PeDaily Add"]),
	new Menu("daily/add-osg", true, null, ["PeDaily Add"]),
	new Menu("daily/edit-osg", true, null, ["PeDaily Add"]),
	new Menu("daily/edit", true,null, ["PeDaily Edit"]),
	new Menu("daily/delete", true,null, ["PeDaily Delete"]),
	new Menu("daily/chart", true, null, ["PeDaily Read"]),
	new Menu("daily/zonechart", true, null, ["PeDaily Read"]),
	new Menu("daily/semilog-chart", true, null, ["PeDaily Read"]),
	new Menu("daily/area-chart", true, null, ["PeDaily Read"]),
	new Menu("daily/per-area-chart", true, null, ["PeDaily Read"]),

	new Menu("production/add", true, null, ["PeProduction Add"]),

	new Menu("sonolog", true,null, ["PeSonolog Read"]),
	new Menu("sonolog/list", true,null, ["PeSonolog Read"]),
	new Menu("sonolog/add", true,null, ["PeSonolog Add"]),
	new Menu("sonolog/edit", true,null, ["PeSonolog Edit"]),
	new Menu("sonolog/delete", true,null, ["PeSonolog Delete"]),
	new Menu("sonolog/sonolog-chart", true, null, ["PeSonolog Read"]),

	
	new Menu("sensor", true,null, ["PeSensor Read"]),
	new Menu("sensor/list", true,null, ["PeSensor Read"]),
	new Menu("sensor/add", true,null, ["PeSensor Add"]),
	new Menu("sensor/edit", true,null, ["PeSensor Edit"]),
	new Menu("sensor/delete", true,null, ["PeSensor Delete"]),

	];
	
	
	constructor(
		private router: Router,
		private authService: AuthService,
		) { 
		this.authService.currentUser.subscribe(res => this.currentUser = res);
	}

  passPermission(path: String) {

	console.log('Checking permission for:', path);
	console.log('Current user:', this.currentUser);

    //if (path.indexOf('/') == -1) path = path.substring(1, path.lastIndexOf('/'))
    if (path.charAt(0) == "/") path = path.substring(1);
    if (path.match(/[/]/g).length > 2) path = path.substring(0, path.lastIndexOf('/'))
    console.log(path)
      var res: boolean = false;
      var ms: Menu[] = this.root.filter(m => path == this.basePath + '/' + m.link);
      console.log(ms)
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
    public parameter : RegExp,
		public permission: string[] = []
		) {}
}
