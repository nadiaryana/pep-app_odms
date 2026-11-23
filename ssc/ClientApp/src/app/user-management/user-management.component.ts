import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TitleService } from '../navigation/title/title.service';

interface UserManagementRow {
  name: string;
  email: string;
  department: string;
  role: string;
  access: string;
  status: string;
  join_date: string | null;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: UserManagementRow[] = [];
  showAddUserDialog = false;
  isLoadingUsers = true;
  isSaving = false;
  loadError = '';
  saveError = '';
  newUser: UserManagementRow = this.createEmptyUser();

  constructor(
    private http: HttpClient,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    this.titleService.titleSource.next({
      title: 'User Management',
      icon: 'manage_accounts',
      breadcrumbs: [{ label: 'User Management', routerLink: '' }]
    });
    this.loadUsers();
  }

  openAddUserDialog() {
    this.newUser = this.createEmptyUser();
    this.saveError = '';
    this.showAddUserDialog = true;
  }

  closeAddUserDialog() {
    if (this.isSaving) {
      return;
    }
    this.showAddUserDialog = false;
  }

  saveUser(form: NgForm) {
    if (form.invalid || this.isSaving) {
      return;
    }

    this.saveError = '';
    this.isSaving = true;
    const userToSave = {
      ...this.newUser,
      join_date: this.newUser.join_date || null
    };

    this.http.post<UserManagementRow>('/api/pe/user', userToSave).subscribe(
      user => {
        this.users = [user, ...this.users];
        this.showAddUserDialog = false;
        this.isSaving = false;
        form.resetForm();
      },
      error => {
        this.isSaving = false;
        this.saveError = this.getHttpErrorMessage(error, 'User could not be saved.');
      }
    );
  }

  private loadUsers() {
    this.isLoadingUsers = true;
    this.loadError = '';

    this.http.get<UserManagementRow[]>('/api/pe/user').subscribe(
      users => {
        this.users = users;
        this.isLoadingUsers = false;
      },
      error => {
        this.isLoadingUsers = false;
        this.loadError = this.getHttpErrorMessage(error, 'Users could not be loaded.');
      }
    );
  }

  private getHttpErrorMessage(error: HttpErrorResponse, fallback: string): string {
    const body = error.error;
    if (body && typeof body.message === 'string') {
      return body.message;
    }
    if (body && typeof body.title === 'string') {
      return body.title;
    }
    return fallback + ' HTTP ' + error.status + '.';
  }

  private createEmptyUser(): UserManagementRow {
    return {
      name: '',
      email: '',
      department: '',
      role: '',
      access: 'On',
      status: 'Active',
      join_date: null
    };
  }
}
