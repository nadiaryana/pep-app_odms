import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from './auth.service';
import { User } from './user';
import { PermissionService } from './permission.service';

import { Panel } from './navigation/panel/panel';
import { PanelItem } from './navigation/panel/panel';
import { CommonService } from './common.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	//changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppComponent {

	currentUser: User;
	root: PanelItem[];
	fullWindow:boolean;
	screenWidth: number;

	constructor(
		private authService: AuthService,
		private permissionService: PermissionService,
		private commonService: CommonService,
		) {

		this.authService.currentUser.subscribe(res => {
			this.currentUser = res;
			this.root = [
		//	new PanelItem("Home", "", "home", this.permissionService.passPermission("")),
		//	new PanelItem("Employee", "employee", "dashboard", this.permissionService.passPermission("employee")),
		//	new PanelItem("Enum", "enum", "dashboard", this.permissionService.passPermission("enum")),
		//	new PanelItem("Location", "location", "dashboard", this.permissionService.passPermission("location")),
			new PanelItem("Logout", "logout", "input", this.permissionService.passPermission("logout"),false,[], {overlay:"logout"}),
			];
		});
		
	}
	title = 'PEP';

	ngOnInit() {
		this.commonService.swMessage.subscribe(width => {
	      this.screenWidth = width;
	    });

		this.commonService.fsMessage.subscribe(res => {
	      	try {
	      		if(res === true ) {
		      		const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
						mozRequestFullScreen(): Promise<void>;
						webkitRequestFullscreen(): Promise<void>;
						msRequestFullscreen(): Promise<void>;
					};

					if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
						docElmWithBrowsersFullScreenFunctions.requestFullscreen();
					} else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
						docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
					} else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
						docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
					} else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
						docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
					}
		      	} else if (res === false && this.fullWindow) {
		      		const docWithBrowsersExitFunctions = document as Document & {
						mozCancelFullScreen(): Promise<void>;
						webkitExitFullscreen(): Promise<void>;
						msExitFullscreen(): Promise<void>;
					};
					if (docWithBrowsersExitFunctions.exitFullscreen) {
						docWithBrowsersExitFunctions.exitFullscreen();
					} else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
						docWithBrowsersExitFunctions.mozCancelFullScreen();
					} else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
						docWithBrowsersExitFunctions.webkitExitFullscreen();
					} else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
						docWithBrowsersExitFunctions.msExitFullscreen();
					}
		      	}
		      	this.fullWindow = res;
	      	} catch (e) {

	      	}
	    });
	}

	passPermission(url: String) {
		return this.permissionService.passPermission(url);
	}
}

