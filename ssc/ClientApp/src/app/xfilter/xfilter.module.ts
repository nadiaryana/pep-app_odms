import { CommonModule }   from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule }    from '@angular/forms';

import { xFilterComponent } from './xfilter.component';
import { xFilterDialogComponent } from './xfilter.component';
import { xFilterDialogNumberComponent } from './xfilter.component';
import { xFilterDialogDateComponent } from './xfilter.component';
import { xFilterDialogTextComponent } from './xfilter.component';
import { xFilterDialogTreeComponent } from './xfilter-dialog-tree.component';

@NgModule({
	declarations: [
		xFilterComponent,
		xFilterDialogComponent,
		xFilterDialogNumberComponent,
		xFilterDialogDateComponent,
		xFilterDialogTextComponent,
		xFilterDialogTreeComponent,
	],
	imports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
	],
	exports: [
		xFilterComponent,
		xFilterDialogComponent,
		xFilterDialogNumberComponent,
		xFilterDialogDateComponent,
		xFilterDialogTextComponent,
		xFilterDialogTreeComponent,
	],
})
export class xFilterModule { }