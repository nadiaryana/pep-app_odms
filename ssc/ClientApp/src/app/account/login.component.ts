import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';
import { TitleService } from '../navigation/title/title.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
	@Input() embedded = false;
	submitting = false;
	hide = true;
	loginForm: FormGroup;
	
	constructor(
		private authService: AuthService,
		private formBuilder: FormBuilder,
		public snackBar: MatSnackBar,
		private titleService: TitleService,
		private router: Router,
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
			this.router.navigate(['/dashboard']);

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

		if (!this.embedded) {
			const sidenavContent = document.querySelector('.mat-sidenav-content') as HTMLElement;
			if (sidenavContent) {
				sidenavContent.style.background = '#f3f4f6';
				sidenavContent.style.backgroundAttachment = 'fixed';
				sidenavContent.style.minHeight = '100vh';
			}
		}

		this.loginForm = this.formBuilder.group({
			// company_id: ['', Validators.required],
			username: ['', Validators.required],
			password: ['', Validators.required],
			remember: [false],
		});
	};

	ngOnDestroy() {
		if (!this.embedded) {
			const sidenavContent = document.querySelector('.mat-sidenav-content') as HTMLElement;
			if (sidenavContent) {
				sidenavContent.style.background = '';
				sidenavContent.style.backgroundAttachment = '';
				sidenavContent.style.minHeight = '';
			}
		}
	}

}
