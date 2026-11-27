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

  get displayName(): string {
    return (this.currentUser && (this.currentUser.DisplayName || this.currentUser.Name)) || '';
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
