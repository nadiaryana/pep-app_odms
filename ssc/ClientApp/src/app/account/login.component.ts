import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { Login }    from '../login';
import { AuthService } from '../auth.service';
//import { Company } from '../company';
import { TitleService } from '../navigation/title/title.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
	// @Input() companies;
	submitting = false;
	loginForm: FormGroup;
	
	constructor(
		private authService: AuthService,
		private formBuilder: FormBuilder,
		public snackBar: MatSnackBar,
		private titleService: TitleService,
		private http: HttpClient,
		private router: Router,
		private route: ActivatedRoute,
	) { }
	  
	onSubmit() { 
		this.submitting = true;
		this.snackBar.dismiss();
		this.loginForm.disable();
		this.authService.login({
			// company_id:this.loginForm.controls.company_id.value, 
			username: this.loginForm.controls.username.value,
			password: this.loginForm.controls.password.value
		}).subscribe(res => {
			
			if(res["errMsg"]) {
				this.snackBar.open(res["errMsg"], 'dismiss');
				this.submitting = false; 
				this.loginForm.enable()
				return;
			}
			localStorage.setItem('token', res.token);
			this.router.navigate(['/dashboard']);
			const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') 
					|| '/dashboard';
			// this.router.navigateByUrl(returnUrl);

			this.submitting = false; 
			this.loginForm.enable();
			console.log('LOGIN RESPONSE:', res);
			
		}, error => {
			this.snackBar.open(error, 'dismiss');
			this.submitting = false; 
			this.loginForm.enable()
		}); 
	}
	
	get f() { return this.loginForm.controls; }
	
	ngOnInit() { 
		this.titleService.titleSource.next(null);

		// Set background untuk halaman login
		const sidenavContent = document.querySelector('.mat-sidenav-content') as HTMLElement;
		if (sidenavContent) {
			sidenavContent.style.background = 'url("assets/image/logo.png") no-repeat';
			sidenavContent.style.backgroundPositionX = 'right';
			sidenavContent.style.backgroundPositionY = 'top';
		}

		this.loginForm = this.formBuilder.group({
			// company_id: ['', Validators.required],
			username: ['', Validators.required],
			password: ['', Validators.required],
		});
		// this.http.get<any>('api/account/company').subscribe(res => {
			// this.companies = res.items;
			// this.loginForm.controls.company_id.setValue(this.companies[0]._id);
		// }); 
	};

	ngOnDestroy() {
		// Hapus background saat keluar dari halaman login
		const sidenavContent = document.querySelector('.mat-sidenav-content') as HTMLElement;
		if (sidenavContent) {
			sidenavContent.style.background = '';
			sidenavContent.style.backgroundPositionX = '';
			sidenavContent.style.backgroundPositionY = '';
		}
	}

}
