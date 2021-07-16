import { Component } from '@angular/core';
import { McqCreationComponent } from '../mcq-creation/mcq-creation.component';

@Component({
  selector: 'app-child',
  template: '',
  providers: [
    {
      provide: McqCreationComponent,
      useClass: McqCreationStubComponent
    }
  ]
})
export class McqCreationStubComponent {
    validateCurrentQuestion() {}
}
