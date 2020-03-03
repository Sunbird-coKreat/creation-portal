import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToasterService } from '@sunbird/shared';

@Component({
  selector: 'app-enroll-contributor',
  templateUrl: './enroll-contributor.component.html',
  styleUrls: ['./enroll-contributor.component.scss']
})
export class EnrollContributorComponent implements OnInit {
  contributorType = 'individual';
  data;
  disableSubmit = false;
  @Output() close = new EventEmitter<any>();

  constructor(private tosterService: ToasterService) { }

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
    this.tosterService.success("You are successfully enrolled as a contributor!");
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }

}
