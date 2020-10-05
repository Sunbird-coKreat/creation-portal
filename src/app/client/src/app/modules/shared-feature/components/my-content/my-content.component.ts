import { ResourceService, ToasterService, ConfigService  } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ProgramsService, ActionService, UserService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-my-content',
  templateUrl: './my-content.component.html',
  styleUrls: ['./my-content.component.scss']
})
export class MyContentComponent implements OnInit {
 

  constructor()  {
  }

  ngOnInit(): void {
   
  }
}
