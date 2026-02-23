import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  constructor(private router: Router) {}

  goAdmin() {
    const returnUrl = sessionStorage.getItem('returnUrl') || '/pe/dashboard';
    this.router.navigate(['/admin/login'], { queryParams: { returnUrl } });
  } 

  goViewer() {
    this.router.navigate(['/viewer/login']);
  }
}
