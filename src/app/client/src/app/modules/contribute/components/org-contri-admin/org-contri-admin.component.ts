import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-org-contri-admin',
  templateUrl: './org-contri-admin.component.html',
  styleUrls: ['./org-contri-admin.component.scss']
})
export class OrgContriAdminComponent implements OnInit {

  constructor() { }
  IsHidden= true;

  onSelect(){
  this.IsHidden=true;
  this.IsHidden= !this.IsHidden;
  }
  ngOnInit() {
  }

}
