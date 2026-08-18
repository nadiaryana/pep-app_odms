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
	hide = true;
	loginForm: FormGroup;
	loginMode: string = 'admin'; // 'admin' | 'viewer' — determined from the current route
	expectedRole: string = 'ssa-pe';
	
	constructor(
		private authService: AuthService,
		private formBuilder: FormBuilder,
		public snackBar: MatSnackBar,
		private titleService: TitleService,
		private http: HttpClient,
		private router: Router,
		private route: ActivatedRoute,
	) { }
	  
	get loginBadge(): string {
		return this.loginMode === 'viewer' ? 'Viewer Panel' : 'Admin Panel';
	}

	get loginTitle(): string {
		return this.loginMode === 'viewer' ? 'Masuk sebagai Viewer' : 'Masuk sebagai Admin';
	}
	  
	onSubmit() { 
		this.submitting = true;
		this.snackBar.dismiss();
		this.loginForm.disable();
		this.authService.login({
			// company_id:this.loginForm.controls.company_id.value, 
			username: this.loginForm.controls.username.value,
			password: this.loginForm.controls.password.value
		}, this.expectedRole).subscribe(res => {
			
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
		this.titleService.titleSource.next({ title: '', icon: '', breadcrumbs: [] });

		// Deteksi halaman login: /admin/login → Admin, /viewer/login → Viewer
		const path = this.route.snapshot.url.map(s => s.path).join('/');
		this.loginMode = path.indexOf('viewer') !== -1 ? 'viewer' : 'admin';
		this.expectedRole = this.loginMode === 'viewer' ? 'ssa-viewer' : 'ssa-pe';

		// Set background gelap full-screen untuk halaman login
		const sidenavContent = document.querySelector('.mat-sidenav-content') as HTMLElement;
		if (sidenavContent) {
			sidenavContent.style.background = '#f3f4f6';
			sidenavContent.style.backgroundAttachment = 'fixed';
			sidenavContent.style.minHeight = '100vh';
		}

		this.loginForm = this.formBuilder.group({
			// company_id: ['', Validators.required],
			username: ['', Validators.required],
			password: ['', Validators.required],
			remember: [false],
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
			sidenavContent.style.backgroundAttachment = '';
			sidenavContent.style.minHeight = '';
		}
	}

}
