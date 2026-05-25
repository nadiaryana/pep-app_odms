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
	new Menu("daily/manajemen-chart", true, null, ["PeDaily Read"]),
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

	new Menu("production", true, null, ["PeProduction Read"]),
	new Menu("production/add", true, null, ["PeProduction Add"]),

	new Menu("sonolog", true,null, ["PeSonolog Read"]),
	new Menu("sonolog/list", true,null, ["PeSonolog Read"]),
	new Menu("sonolog/add", true,null, ["PeSonolog Add"]),
	new Menu("sonolog/edit", true,null, ["PeSonolog Edit"]),
	new Menu("sonolog/delete", true,null, ["PeSonolog Delete"]),
	new Menu("sonolog/sonolog-chart", true, null, ["PeSonolog Read"]),

	
	new Menu("bhp", true,null, ["PeBhp Read"]),
	new Menu("bhp/list", true,null, ["PeBhp Read"]),
	new Menu("bhp/add", true,null, ["PeBhp Add"]),
	new Menu("bhp/edit", true,null, ["PeBhp Edit"]),
	new Menu("bhp/delete", true,null, ["PeBhp Delete"]),
	new Menu("bhp/bhp-chart", true, null, ["PeBhp Read"]),

	new Menu("current", true, null, ["PeSumur Read"]),
	new Menu("current/list", true, null, ["PeSumur Read"]),
	new Menu("current/add", true, null, ["PeSumur Add"]),
	new Menu("current/edit", true, null, ["PeSumur Edit"]),
	new Menu("current/delete", true, null, ["PeSumur Delete"]),

	new Menu("chan-plot", true, null, ["PeChanPlot Read"]),
	new Menu("chan-plot/list", true, null, ["PeChanPlot Read"]),
	new Menu("chan-plot/chart", true, null, ["PeChanPlot Read"]),

	new Menu("aggregate", true, null, ["PeAggregate Read"]),
	new Menu("aggregate/list", true, null, ["PeAggregate Read"]),

	// barchart permission
	new Menu("barchart", true,null, ["PeBarchart Read"]),
	new Menu("barchart/list", true,null, ["PeBarchart Read"]),
	new Menu("barchart/add", true,null, ["PeBarchart Add"]),
	new Menu("barchart/edit", true,null, ["PeBarchart Edit"]),
	new Menu("barchart/delete", true,null, ["PeBarchart Delete"]),
	new Menu("barchart/chart", true, null, ["PeBarchart Read"]),
	
	// new Menu("one-slide", true, null, ["PeOneSlide Read"]),

	new Menu("lab", true,null, ["PeLab Read"]),
	new Menu("lab/list", true,null, ["PeLab Read"]),
	new Menu("lab/reports", true,null, ["PeLab Read"]),
	new Menu("lab/add", true,null, ["PeLab Add"]),
	new Menu("lab/edit", true, /[a-z]/i, ["PeLab Edit"]),
	new Menu("lab/delete", true,null, ["PeLab Delete"]),
	new Menu("lab/chart", true,null, ["PeLab Read"]),
	
	new Menu("optimasi", true, null, ["PeOptimasi Read"]),
	new Menu("optimasi/list", true, null, ["PeOptimasi Read"]),
	new Menu("optimasi/chart", true, null, ["PeOptimasi Read"]),
	

	new Menu("laporan", true,null, ["PeLaporanLab Read"]),
	new Menu("laporan/list", true,null, ["PeLaporanLab Read"]),
	new Menu("laporan/add", true,null, ["PeLaporanLab Add"]),
	new Menu("laporan/edit", true,null, ["PeLaporanLab Edit"]),
	// new Menu("lab/edit", true, /[a-z]/i, ["PeLab Edit"]),
	new Menu("laporan/delete", true,null, ["PeLaporanLab Delete"]),
	new Menu("laporan/chart", true,null, ["PeLaporanLab Read"]),
	

	new Menu("map", true,null, ["PeMap Read"]),
	new Menu("map/list", true,null, ["PeMap Read"]),
	new Menu("map/add", true,null, ["PeMap Add"]),
	new Menu("map/delete", true,null, ["PeMap Delete"]),
	
	new Menu("pump", true,null, ["PePumpingUnit Read"]),
	new Menu("pump/list", true,null, ["PePumpingUnit Read"]),
	new Menu("pump/add", true,null, ["PePumpingUnit Add"]),
	new Menu("pump/edit", true, /[a-z]/i, ["PePumpingUnit Edit"]),
	new Menu("pump/delete", true,null, ["PePumpingUnit Delete"]),

	new Menu("well-database", true, null, ["PeWellDatabase Read"]),
	new Menu("well-database/list", true, null, ["PeWellDatabase Read"]),
	new Menu("well-database/add", true, null, ["PeWellDatabase Add"]),
	new Menu("well-database/edit", true, /[a-z]/i, ["PeWellDatabase Edit"]),
	new Menu("well-database/delete", true,null, ["PeWellDatabase Delete"]),

	new Menu("actual", true, null, ["PeActual Read"]),
	new Menu("actual/list", true, null, ["PeActual Read"]),
	new Menu("actual/add", true, null, ["PeActual Add"]),
	new Menu("actual/edit", true, /[a-z]/i, ["PeActual Edit"]),
	new Menu("actual/delete", true,null, ["PeActual Delete"]),
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
