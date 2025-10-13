import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';

import { SnackbarService } from './snackbar.service';
import { SnackbarApi } from './snackbar.service';

@Component({
    selector: 'app-snackbar-message',
    template: '<div></div>'
})
export class SnackbarComponent { 
    open: boolean = false;

    constructor(
    	public snackBar: MatSnackBar,
    	public snackbarService: SnackbarService
    ) {
        snackbarService.status$.subscribe((obj: SnackbarApi) => {
        	this.open = obj.open;
        	if (this.open) {
        		this.snackBar.open(obj.mesage, obj.action, obj.config);
        	} else {
        		this.snackBar.dismiss();
        	}
        });
    }
}

