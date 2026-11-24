import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TitleService } from '../navigation/title/title.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

interface UserManagementRow {
  _id?: string;
  name: string;
  email: string;
  department: string;
  role: string;
  access: {
    menu: string;
    permissions: string[];
  }[];
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
  isEditMode = false;
  editingUserId: string | null = null;
  deletingUserId: string | null = null;
  pendingDeleteUser: UserManagementRow | null = null;
  loadError = '';
  saveError = '';
  actionError = '';
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

  // Daftar permission yang tersedia
  allAccess: string[] = [
    'Daily Production',
    'Sonolog',
    'Chan plot',
    'PE Dashboard',
    'Aggregate',
    'Well Data',
    'Barchart',
    'Optimasi',
    'ISRP',
    'Arus',
    'Map',
    'Pumping Unit'
  ];

  // Input pencarian access
  accessInput = '';

  openAddUserDialog() {
    this.newUser = this.createEmptyUser();
    this.accessInput = '';
    this.isEditMode = false;
    this.editingUserId = null;
    this.saveError = '';
    this.showAddUserDialog = true;
  }

  openEditUserDialog(user: UserManagementRow) {
    this.newUser = {
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      access: [...(user.access || [])],
      status: user.status,
      join_date: this.toDateInputValue(user.join_date)
    };
    this.accessInput = '';
    this.isEditMode = true;
    this.editingUserId = user._id || null;
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

    if (this.isEditMode && !this.editingUserId) {
      this.saveError = 'User ID tidak ditemukan.';
      return;
    }

    this.saveError = '';
    this.isSaving = true;
    const userToSave = {
      ...this.newUser,
      join_date: this.newUser.join_date || null
    };

    const request = this.isEditMode && this.editingUserId
      ? this.http.put<UserManagementRow>('/api/pe/user/' + this.editingUserId, userToSave)
      : this.http.post<UserManagementRow>('/api/pe/user', userToSave);

    request.subscribe(
      user => {
        if (this.isEditMode) {
          this.users = this.users.map(existing => existing._id === user._id ? user : existing);
        } else {
          this.users = [user, ...this.users];
        }
        this.showAddUserDialog = false;
        this.isEditMode = false;
        this.editingUserId = null;
        this.isSaving = false;
        form.resetForm();
      },
      error => {
        this.isSaving = false;
        this.saveError = this.getHttpErrorMessage(error, 'User could not be saved.');
      }
    );
  }

  deleteUser(user: UserManagementRow) {
    if (!user._id || this.deletingUserId) {
      return;
    }

    this.actionError = '';
    this.pendingDeleteUser = user;
  }

  cancelDeleteUser() {
    if (this.deletingUserId) {
      return;
    }
    this.pendingDeleteUser = null;
  }

  confirmDeleteUser() {
    const user = this.pendingDeleteUser;
    const userId = user && user._id;
    if (!user || !userId || this.deletingUserId) {
      return;
    }

    this.actionError = '';
    this.deletingUserId = userId;
    this.http.delete('/api/pe/user/' + userId).subscribe(
      () => {
        this.users = this.users.filter(existing => existing._id !== userId);
        this.deletingUserId = null;
        this.pendingDeleteUser = null;
      },
      error => {
        this.deletingUserId = null;
        this.pendingDeleteUser = null;
        this.actionError = this.getHttpErrorMessage(error, 'User could not be deleted.');
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

  private toDateInputValue(value: string | null): string | null {
    if (!value) {
      return null;
    }
    return value.length >= 10 ? value.substring(0, 10) : value;
  }

  private createEmptyUser(): UserManagementRow {
    return {
      name: '',
      email: '',
      department: '',
      role: '',
      access: [],
      status: 'Active',
      join_date: null
    };
  }

  // Filter access berdasarkan input
  get filteredAccess(): string[] {
    const search = (this.accessInput || '').toLowerCase().trim();

    return this.allAccess.filter(access =>
      access.toLowerCase().includes(search) &&
      !this.newUser.access.includes(access)
    );
  }

  // Menambahkan access
  addAccess(access: string) {
    if (
      access &&
      !this.newUser.access.includes(access)
    ) {
      this.newUser.access.push(access);
    }

    this.accessInput = '';
  }

  // Menghapus access
  removeAccess(access: string) {
    this.newUser.access = this.newUser.access.filter(
      item => item !== access
    );
  }
}
