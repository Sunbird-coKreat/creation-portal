import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enroll-contributor',
  templateUrl: './enroll-contributor.component.html',
  styleUrls: ['./enroll-contributor.component.scss']
})
export class EnrollContributorComponent implements OnInit {
  contributorType = 'individual';
  data;
  nameOfOrgani;
  constructor() { }

  ngOnInit(): void {
    this.nameOfOrgani= "Name of organi";
    this.data =
    {
      'filteredOptions' :
      [{'name': 'NCERT', 'value': 'NCERT'}, {'name': 'CBSE', 'value': 'CBSE'}, {'name': 'ICSE', 'value': 'ICSE'}, {'name': 'UP', 'value': 'UP'}]
    }
  }

}
