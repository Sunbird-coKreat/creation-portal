import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-content-list-header',
  templateUrl: './content-list-header.component.html',
  styleUrls: ['./content-list-header.component.scss']
})
export class ContentListHeaderComponent implements OnInit {
  @ViewChild('createPopUpMat') createPopUpMat: TemplateRef<any>;
  @ViewChild('filterPopUpMat') filterPopUpMat: TemplateRef<any>;
  dialogRef: any;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openCreatePopUpMat() {
    if(this.createPopUpMat){
      this.dialogRef = this.dialog.open(this.createPopUpMat);
    }
  }
  openFilterPopUpMat() {
    if(this.filterPopUpMat){
      this.dialogRef = this.dialog.open(this.filterPopUpMat);
    }
  }
  closeDialog() {
    if(this.dialogRef){
      this.dialogRef.close();
    }
  }

}
