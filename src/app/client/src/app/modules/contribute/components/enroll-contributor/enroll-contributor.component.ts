import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enroll-contributor',
  templateUrl: './enroll-contributor.component.html',
  styleUrls: ['./enroll-contributor.component.scss']
})
export class EnrollContributorComponent implements OnInit {
  contributorType = 'individual';
  showModal = false;
  data;
  constructor() { }

  ngOnInit(): void {
    this.data =
    {
      'board' : [
        {'name': 'NCERT', 'value': 'NCERT'}, 
        {'name': 'CBSE', 'value': 'CBSE'}, 
        {'name': 'ICSE', 'value': 'ICSE'}, 
        {'name': 'UP', 'value': 'UP'}
      ],
      'medium' : [
        {'name': 'English', 'value': 'English'}, 
        {'name': 'Marathi', 'value': 'Marathi'}, 
        {'name': 'Hindi', 'value': 'Hindi'}, 
        {'name': 'Oriya', 'value': 'Oriya'}
      ],
      'grade' : [
        {'name': 'Grade 1', 'value': 'Grade1'}, 
        {'name': 'Grade 2', 'value': 'Grade2'}, 
        {'name': 'Grade 3', 'value': 'Grade3'}, 
        {'name': 'Grade 4', 'value': 'Grade4'}
      ],
      'subject' : [
        {'name': 'Marathi', 'value': 'Marathi'}, 
        {'name': 'Hindi', 'value': 'Hindi'}, 
        {'name': 'English', 'value': 'English'}, 
        {'name': 'Science', 'value': 'Science'}
      ]
    }
  }

  handleSubmit() {
    console.log("submit");
  }

}
