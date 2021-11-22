import { Component, Input, OnInit } from '@angular/core';
import { ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-transcripts-review',
  templateUrl: './transcripts-review.component.html',
  styleUrls: ['./transcripts-review.component.scss']
})
export class TranscriptsReviewComponent implements OnInit {
  @Input() contentTranscript;
  transcripts = [];

  constructor(public toasterService: ToasterService) { }

  ngOnInit(): void {
    this.transcripts = this.contentTranscript;
    _.forEach(this.transcripts, transcript => {
      if (!_.isEmpty(transcript.artifactUrl)) {
        transcript['fileName'] = transcript.artifactUrl.split('/').pop();
      } else {
        transcript['fileName'] = '';
      }
    });
  }

  downloadFile(artifactUrl) {
    if (!_.isEmpty(artifactUrl)) {
      window.open(artifactUrl, '_blank');
    } else {
      this.toasterService.error('Something went wrong');
    }
  }

}
