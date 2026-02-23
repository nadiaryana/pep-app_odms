import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '../navigation/title/title.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  constructor(private router: Router, private titleService: TitleService) {}

  goAdmin() {
    const returnUrl = sessionStorage.getItem('returnUrl') || '/pe/dashboard';
    this.router.navigateByUrl('/admin/login');
  } 

  goViewer() {
    this.router.navigateByUrl('/viewer/login');
  }
  
  ngOnInit() {

    this.titleService.titleSource.next({
      title: "",
      icon: "",
      breadcrumbs: []
    });

  }
}
