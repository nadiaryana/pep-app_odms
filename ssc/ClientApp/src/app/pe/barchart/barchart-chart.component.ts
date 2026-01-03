import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../navigation/title/title.service';

@Component({
  selector: 'app-barchart-chart',
  templateUrl: './barchart-chart.component.html',
  styleUrls: ['./barchart.scss']
})
export class BarchartChartComponent implements OnInit {

  constructor(
    private titleService: TitleService,
  ) { }

  ngOnInit() {
    this.titleService.titleSource.next({
      title: "Barchart Chart",
      icon: "bar_chart",
      breadcrumbs: [
        { label: 'Petroleum Engineering', routerLink: '' },
        { label: 'Barchart', routerLink: 'pe/barchart' },
        { label: 'Chart', routerLink: '' }
      ]
    });
  }

}

