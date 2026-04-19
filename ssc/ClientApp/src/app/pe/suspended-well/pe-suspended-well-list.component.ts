import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/navigation/title/title.service';

@Component({
  selector: 'app-pe-suspended-well-list',
  templateUrl: './pe-suspended-well-list.component.html',
})
export class PeSuspendedWellListComponent implements OnInit {

  constructor(private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.titleSource.next({
      title: 'Suspended Well',
      icon: 'pause_circle',
      breadcrumbs: [],
    });
  }
}
