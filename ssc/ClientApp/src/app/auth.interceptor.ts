import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { SnackbarApi } from './snackbar.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    public snackbarService: SnackbarService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isApiRequest = request.url.indexOf('/api/') === 0 || request.url.indexOf('api/') === 0;
    const isLoginRequest = request.url.toLowerCase().indexOf('api/account/login') !== -1;
    const token = isApiRequest && !isLoginRequest ? localStorage.getItem('token') : null;
    const authenticatedRequest = token && token !== 'undefined' && token !== 'null'
      ? request.clone({ setHeaders: { Authorization: 'Bearer ' + token } })
      : request;

    return next.handle(authenticatedRequest).pipe( tap(() => {},
      (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status !== 401) {
         return;
        }
        this.router.navigate([{outlets:{overlay:"logout"}}]);
        this.snackbarService.status.next(new SnackbarApi(true, 'Your session has been ended. Please re-login.', 'dismiss'));
      }
    }));
  }
}