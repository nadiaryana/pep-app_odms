import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TitleService } from '../navigation/title/title.service';

interface UserManagementRow {
  _id?: string;
  username: string;
  password?: string; // hanya dikirim saat save, tidak pernah dikembalikan server
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  join_date: string | null;
}

interface RoleRow {
  _id?: string;
  name: string;
  description: string;
  permission: string[];
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dialogHost', { static: true }) dialogHost: ElementRef;

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

  statusTabs = [
    { label: 'View all', value: '' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];
  selectedStatus = '';
  searchTerm = '';
  showFilterPanel = false;
  roleFilter = '';
  departmentFilter = '';

  constructor(
    private http: HttpClient,
    private titleService: TitleService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.titleService.titleSource.next({
      title: 'User Management',
      icon: 'manage_accounts',
      breadcrumbs: [{ label: 'User Management', routerLink: '' }]
    });
    this.loadUsers();
    this.loadRoles();
  }

  // Dialog dipindah ke <body>, karena di dalam mat-sidenav-content
  // dialog selalu tertutup sidebar & toolbar (z-index tidak bisa menang)
  ngAfterViewInit() {
    document.body.appendChild(this.dialogHost.nativeElement);
  }

  ngOnDestroy() {
    document.body.removeChild(this.dialogHost.nativeElement);
  }

  openAddUserDialog() {
    this.newUser = this.createEmptyUser();
    this.isEditMode = false;
    this.editingUserId = null;
    this.saveError = '';
    this.showAddUserDialog = true;
  }

  openEditUserDialog(user: UserManagementRow) {
    this.newUser = {
      username: user.username,
      password: '',
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      status: user.status,
      join_date: this.toDateInputValue(user.join_date)
    };
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
          this.snackBar.open('User berhasil diupdate', 'Tutup', { duration: 3000 });
        } else {
          this.users = [user, ...this.users];
          this.snackBar.open('User berhasil ditambahkan', 'Tutup', { duration: 3000 });
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
        this.snackBar.open('Gagal menyimpan user: ' + this.saveError, 'Tutup', { duration: 5000 });
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

  get filteredUsers(): UserManagementRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.users.filter(user => {
      if (this.selectedStatus && user.status !== this.selectedStatus) {
        return false;
      }
      if (this.roleFilter && user.role !== this.roleFilter) {
        return false;
      }
      if (this.departmentFilter && user.department !== this.departmentFilter) {
        return false;
      }
      if (!term) {
        return true;
      }
      return [user.name, user.username, user.email, user.department, user.role]
        .some(value => (value || '').toLowerCase().includes(term));
    });
  }

  get departments(): string[] {
    const set = new Set<string>();
    this.users.forEach(user => user.department && set.add(user.department));
    return Array.from(set).sort();
  }

  get activeFilterCount(): number {
    return (this.roleFilter ? 1 : 0) + (this.departmentFilter ? 1 : 0);
  }

  countByStatus(value: string): number {
    return value ? this.users.filter(u => u.status === value).length : this.users.length;
  }

  selectStatus(value: string) {
    this.selectedStatus = value;
  }

  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  resetFilters() {
    this.roleFilter = '';
    this.departmentFilter = '';
    this.searchTerm = '';
    this.selectedStatus = '';
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
      username: '',
      password: '',
      name: '',
      email: '',
      department: '',
      role: '',
      status: 'Active',
      join_date: null
    };
  }

  // ================= ROLE MANAGEMENT =================

  roles: RoleRow[] = [];
  showRoleDialog = false;
  selectedRole: RoleRow | null = null; // role yang sedang diedit (salinan)
  isNewRole = false;
  isSavingRole = false;
  roleError = '';

  // Baris matriks = modul, kolom = aksi.
  // Permission disimpan sebagai "<Modul> <Aksi>", contoh: "PeDaily Read"
  roleModules: string[] = [
    'PeDashboard',
    'PeDaily',
    'PeProduction',
    'PeSonolog',
    'PeSensor',
    'PeSumur',
    'PeChanPlot',
    'PeBhp',
    'PeBarchart',
    'PeAggregate',
    'PeLab',
    'PeLaporanLab',
    'PeOptimasi',
    'PeMap',
    'PePumpingUnit',
    'PeWellDatabase',
    'PeActual',
    'PeMonitoringRK',
    'PeIot',
    'PeProdWaterfall',
    // 'Location'
    'User Management',
  ];
  roleActions: string[] = ['Read', 'Add', 'Edit', 'Delete'];

  // Permission tanpa aksi
  singlePermissions: string[] = [];

  loadRoles() {
    this.http.get<RoleRow[]>('/api/pe/role').subscribe(
      roles => this.roles = roles,
      error => this.roleError = this.getHttpErrorMessage(error, 'Roles could not be loaded.')
    );
  }

  openRoleDialog() {
    this.roleError = '';
    this.showRoleDialog = true;
    if (this.roles.length > 0) {
      this.selectRole(this.roles[0]);
    } else {
      this.newRole();
    }
  }

  closeRoleDialog() {
    if (this.isSavingRole) {
      return;
    }
    this.showRoleDialog = false;
    this.selectedRole = null;
  }

  selectRole(role: RoleRow) {
    this.isNewRole = false;
    this.roleError = '';
    // Salin supaya perubahan belum masuk ke list sebelum disimpan
    this.selectedRole = {
      _id: role._id,
      name: role.name,
      description: role.description || '',
      permission: [...(role.permission || [])]
    };
  }

  newRole() {
    this.isNewRole = true;
    this.roleError = '';
    this.selectedRole = { name: '', description: '', permission: [] };
  }

  isActiveRole(role: RoleRow): boolean {
    return !this.isNewRole && !!this.selectedRole && this.selectedRole._id === role._id;
  }

  hasPermission(permission: string): boolean {
    return !!this.selectedRole && this.selectedRole.permission.includes(permission);
  }

  togglePermission(permission: string) {
    if (!this.selectedRole) {
      return;
    }
    if (this.hasPermission(permission)) {
      this.selectedRole.permission = this.selectedRole.permission.filter(p => p !== permission);
    } else {
      this.selectedRole.permission.push(permission);
    }
  }

  selectAllPermissions() {
    if (!this.selectedRole) {
      return;
    }
    for (const menu of this.roleModules) {
      for (const action of this.roleActions) {
        const permission = menu + ' ' + action;
        if (!this.hasPermission(permission)) {
          this.selectedRole.permission.push(permission);
        }
      }
    }
    for (const permission of this.singlePermissions) {
      if (!this.hasPermission(permission)) {
        this.selectedRole.permission.push(permission);
      }
    }
  }

  clearAllPermissions() {
    if (this.selectedRole) {
      this.selectedRole.permission = [];
    }
  }

  saveRole(form: NgForm) {
    if (!this.selectedRole || form.invalid || this.isSavingRole) {
      return;
    }

    this.roleError = '';
    this.isSavingRole = true;

    const request = this.isNewRole
      ? this.http.post<RoleRow>('/api/pe/role', this.selectedRole)
      : this.http.put<RoleRow>('/api/pe/role/' + this.selectedRole._id, this.selectedRole);

    request.subscribe(
      saved => {
        if (this.isNewRole) {
          this.roles = [...this.roles, saved];
        } else {
          this.roles = this.roles.map(role => role._id === saved._id ? saved : role);
        }
        this.isSavingRole = false;
        this.selectRole(saved);
        this.snackBar.open('Role "' + saved.name + '" berhasil disimpan', 'Tutup', { duration: 3000 });
      },
      error => {
        this.isSavingRole = false;
        this.roleError = this.getHttpErrorMessage(error, 'Role could not be saved.');
        this.snackBar.open('Gagal menyimpan role: ' + this.roleError, 'Tutup', { duration: 5000 });
      }
    );
  }

  deleteRole() {
    const role = this.selectedRole;
    if (!role || !role._id || this.isSavingRole) {
      return;
    }
    if (!confirm('Hapus role "' + role.name + '"?')) {
      return;
    }

    this.isSavingRole = true;
    this.http.delete('/api/pe/role/' + role._id).subscribe(
      () => {
        this.roles = this.roles.filter(r => r._id !== role._id);
        this.isSavingRole = false;
        if (this.roles.length > 0) {
          this.selectRole(this.roles[0]);
        } else {
          this.newRole();
        }
      },
      error => {
        this.isSavingRole = false;
        this.roleError = this.getHttpErrorMessage(error, 'Role could not be deleted.');
      }
    );
  }
}
