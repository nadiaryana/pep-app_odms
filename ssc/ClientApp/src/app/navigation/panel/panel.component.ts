import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Panel } from './panel';
import { PanelItem } from './panel';
import { PanelService } from './panel.service';
import { AuthService } from '../../auth.service';
import { PermissionService } from '../../permission.service';
import { Login } from '../../login';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})

export class PanelComponent implements OnInit {

  panels: Panel[] = [];
  root: PanelItem[];
  step = 0;

  constructor(
    private panelService: PanelService,
    private authService: AuthService,
    private permissionService: PermissionService,
	private http: HttpClient,
    
    ) { 
	// this.authService.login.subscribe(res => {console.log("what is : "+JSON.stringify(res.user.DisplayName));})
    this.authService.currentUser.subscribe(res => {
      if(res != null) {
        this.root = [
         // new PanelItem("Home", "", "home", this.permissionService.passPermission("")),
         // new PanelItem("Employee", "employee", "dashboard", this.permissionService.passPermission("employee")),
         // new PanelItem("Enum", "enum", "dashboard", this.permissionService.passPermission("enum")),
         // new PanelItem("Location", "location", "dashboard", this.permissionService.passPermission("location")),
          new PanelItem("Logout", "logout", "input", this.permissionService.passPermission("logout"), false, [], {overlay:"logout"}),
          ];
        this.addPanel(new Panel("Hi, "+res.DisplayName, 0, this.root));
		console.log("who this : "+res.DisplayName);
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

  setStep(index: number) {
    this.step = index;
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
