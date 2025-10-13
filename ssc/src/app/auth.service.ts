import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

//import { User } from './user';
import { Login }    from './login';
//import { Company } from './company';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
	
  private currentUserSubject: BehaviorSubject<any>;
  private state: RouterStateSnapshot;
  
  constructor(
	private http: HttpClient,
	private active: ActivatedRoute,
	private router: Router
  ) { 
	this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser')));
  }
  
  	public get currentUser(): Observable<any> {
		return this.currentUserSubject.asObservable();
	}

    login(login) {
		return this.http.post<any>('api/account/login', login)
		.pipe(map(res => {
			// login successful if there's a jwt token in the response
			if (res.user) { // && user.token
				// store user details and jwt token in local storage to keep user logged in between page refreshes
				sessionStorage.setItem('currentUser', JSON.stringify(res.user));
				this.currentUserSubject.next(res.user);
				this.router.navigate([this.active.snapshot.queryParams['returnUrl'] ? this.active.snapshot.queryParams['returnUrl'] : '']);
			}
			if (res.timezone) {
				sessionStorage.setItem('serverTimezone', JSON.stringify(res.timezone));
			}
			return res;
		}, error => {
			return error;
		}));
    }

    logout() {
		return this.http.get<any>('api/account/logout')
		.pipe(map(res => {
			if (res.errMsg == null) { 
				sessionStorage.removeItem('currentUser');
				sessionStorage.removeItem('serverTimezone');
    		    this.currentUserSubject.next(null);
    		    this.router.navigate([{ outlets: { overlay: null } }])
      				.then(_ => this.router.navigate(['/login']));
				//this.router.navigate(['/login', {outlets: {overlay:null}}]);
			}
			return res;
		}, error => {
			this.router.navigate([{ outlets: { overlay: null } }]);
			return error;
		}));
    }
}
