import { Component, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SnackbarService {
    status: BehaviorSubject<SnackbarApi> = new BehaviorSubject(new SnackbarApi(false));
    status$: Observable<SnackbarApi> = this.status.asObservable();
}

export class SnackbarApi {
	constructor(
		public open: boolean = true,
		public mesage: string = '',
		public action: string = '',
		public config: object = {},
    ) {}
}