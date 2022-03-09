import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-published',
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.scss']
})
export class PublishedComponent implements OnInit {
  @ViewChild('createPopUpMat') createPopUpMat: TemplateRef<any>;
  @ViewChild('filterPopUpMat') filterPopUpMat: TemplateRef<any>;
  public showFilterModal = false;
  public showCreateModal = false;
  dialogRef: any;
  constructor(public dialog: MatDialog) {}

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
