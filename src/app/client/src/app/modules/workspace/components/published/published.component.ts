import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '@sunbird/core';
import * as _ from 'lodash-es';

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

  searchService: SearchService;
  contents: any;
  showLoader: boolean = true;

  constructor(searchService: SearchService, public dialog: MatDialog) {
    this.searchService = searchService;
  }

  ngOnInit(): void {
    console.log(this.searchService);
    this.getContents(0);
  }

  getContents(offset) {
    this.showLoader = true;
    const req = {
      "filters": {
        "status": [
          "Live"
        ],
        // @Todo - add created by to show only creator published content
        // "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
        "objectType": "Content",
        "primaryCategory": [
          "Course Assessment",
          "eTextbook",
          "Explanation Content",
          "Learning Resource",
          "Practice Question Set",
          "Teacher Resource",
          "Exam Question",
          "Content Playlist",
          "Course",
          "Digital Textbook",
          "Question paper"
        ]
      },
      "offset": offset,
      "limit": 200,
      "query": "",
      "sort_by": {
        "lastUpdatedOn": "desc"
      }
    };

    this.searchService.compositeSearch(req).subscribe(res => {
      if (res.responseCode === "OK") {
        this.contents = _.get(res, 'result');
        this.showLoader = false;
      }
    }, error => {
      console.log(error);
    });
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
