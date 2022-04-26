import { Component, OnInit } from '@angular/core';

import { Panel } from './panel';
import { PanelItem } from './panel';
import { PanelService } from './panel.service';
import { AuthService } from '../../auth.service';
import { PermissionService } from '../../permission.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})

export class PanelComponent implements OnInit {

  panels: Panel[] = [];
  root: PanelItem[];

  constructor(
    private panelService: PanelService,
    private authService: AuthService,
    private permissionService: PermissionService,
    ) { 
    
    this.authService.currentUser.subscribe(res => {
      if(res != null) {
        this.root = [
          new PanelItem("Home", "", "home", this.permissionService.passPermission("")),
          new PanelItem("Employee", "employee", "dashboard", this.permissionService.passPermission("employee")),
          new PanelItem("Enum", "enum", "dashboard", this.permissionService.passPermission("enum")),
          new PanelItem("Location", "location", "dashboard", this.permissionService.passPermission("location")),
          new PanelItem("Logout", "logout", "input", this.permissionService.passPermission("logout"), {overlay:"logout"}),
          ];
        this.addPanel(new Panel("Menu", 0, this.root));
      } else {
        this.panels = [];
      }
    })
    
    this.panelService.currentMessage.subscribe(res => {
      if(res.title != null && res.items.filter(i => i.permission).length > 0) {
        this.addPanel(res);
        //console.log("add panel "+res.title+" "+this.panels.length);
      }
    });
  }

  addPanel(item) {
    for(var i=0; i<this.panels.length; i++) {
     if(this.panels[i].title == item.title) {
      this.panels.splice(i, 1);
      break;
     } 
    }
    this.panels.push(item);
  }

  ngOnInit() {

  }

}
