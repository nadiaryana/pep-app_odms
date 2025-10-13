import { Component, Input } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { Login }    from '../login';
import { AuthService } from '../auth.service';
//import { Company } from '../company';
import { TitleService } from '../navigation/title/title.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
	// @Input() companies;
	submitting = false;
	loginForm: FormGroup;
	
	constructor(
		private authService: AuthService,
		private formBuilder: FormBuilder,
		public snackBar: MatSnackBar,
		private titleService: TitleService,
		private http: HttpClient,
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
			}
			this.submitting = false; 
			this.loginForm.enable()
		}, error => {
			this.snackBar.open(error, 'dismiss');
			this.submitting = false; 
			this.loginForm.enable()
		}); 
	}
	
	get f() { return this.loginForm.controls; }
	
	ngOnInit() { 
		this.titleService.titleSource.next(null);

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

}
