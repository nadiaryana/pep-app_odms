import { Component, OnInit } from '@angular/core';

import { User } from '../user';
import { AuthService } from '../auth.service';
import { TitleService } from '../navigation/title/title.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	currentUser: User;

 	constructor(
		private authService: AuthService,
		private titleService: TitleService,
		) {
 		this.titleService.titleSource.next(null);

		this.authService.currentUser.subscribe(res => {
			this.currentUser = res;
			console.log(this.currentUser);
		});
	}

  ngOnInit() {
  }

  logout() {
  	this.authService.logout().subscribe(res => {
		if(res.errMsg) {
			//this.snackBar.open(res.errMsg, 'dismiss');
		}
		//this.loading = false; 
	}, error => {
		//this.snackBar.open("Server error", 'dismiss');
		//this.loading = false; 
	}); 
  }

}
