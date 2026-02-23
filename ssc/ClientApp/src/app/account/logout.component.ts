import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})

export class LogoutComponent {
	loading = false;
	
	constructor(
		private authService: AuthService,
		public snackBar: MatSnackBar,
		private router: Router,
	) { }
	
	ngOnInit() { 
		this.loading = true;
		this.snackBar.dismiss();
		this.authService.logout().subscribe(res => {
			if(res.errMsg) {
				this.snackBar.open(res.errMsg, 'dismiss');
			}
			this.loading = false; 
			this.router.navigate(['/landing']);
		}, error => {
			this.snackBar.open("Server error", 'dismiss');
			this.loading = false; 
			this.router.navigate(['/landing']);
		}); 
	};

}
