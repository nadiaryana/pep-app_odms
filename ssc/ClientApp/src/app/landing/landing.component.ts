import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '../navigation/title/title.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {

  currentUser: any = null;
  private userSub: Subscription;

  constructor(
    private router: Router,
    private titleService: TitleService,
    private authService: AuthService
  ) {}

  get isAdmin(): boolean {
    return this.currentUser != null &&
      (this.currentUser.Role === 'ssa-pe' || this.currentUser.Name === 'pe.admin');
  }

  get isViewer(): boolean {
    return this.currentUser != null && !this.isAdmin;
  }

  get displayName(): string {
    return (this.currentUser && (this.currentUser.DisplayName || this.currentUser.Name)) || '';
  }

  goAdmin() {
    // Jika sudah login sebagai Admin, langsung ke dashboard
    if (this.currentUser && this.isAdmin) {
      this.router.navigateByUrl('/dashboard');
      return;
    }
    this.router.navigateByUrl('/admin/login');
  }

  goViewer() {
    // Jika sudah login sebagai Viewer, langsung ke dashboard
    if (this.currentUser && this.isViewer) {
      this.router.navigateByUrl('/dashboard');
      return;
    }
    this.router.navigateByUrl('/viewer/login');
  }

  goDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

  ngOnInit() {
    this.titleService.titleSource.next({
      title: "",
      icon: "",
      breadcrumbs: []
    });

    this.userSub = this.authService.currentUser.subscribe(res => {
      this.currentUser = res;
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
