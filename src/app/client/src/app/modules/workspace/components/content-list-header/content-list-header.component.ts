import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-content-list-header',
  templateUrl: './content-list-header.component.html',
  styleUrls: ['./content-list-header.component.scss']
})
export class ContentListHeaderComponent implements OnInit {
  @ViewChild('createPopUpMat') createPopUpMat: TemplateRef<any>;
  @ViewChild('filterPopUpMat') filterPopUpMat: TemplateRef<any>;
  dialogRef: any;
  public filterForm: FormGroup;
  showFiltersModal = false;

  constructor(public dialog: MatDialog,
    public sbFormBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.sbFormBuilder.group({
      board: [],
      medium: [],
      gradeLevel: [],
      subject: []
    });
  }

  openCreatePopUpMat() {
    if(this.createPopUpMat){
      this.dialogRef = this.dialog.open(this.createPopUpMat);
    }
  }
  openFilterPopUpMat() {
    this.showFiltersModal = true;
    // if(this.filterPopUpMat){
      // this.dialogRef = this.dialog.open(this.filterPopUpMat);
    // }
  }
  closeDialog() {
    if(this.dialogRef){
      this.dialogRef.close();
    }
  }

  getProgramsListByRole(e) {

  }
}
