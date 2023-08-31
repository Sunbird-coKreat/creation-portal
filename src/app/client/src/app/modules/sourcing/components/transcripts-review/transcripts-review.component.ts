import { Component, Input, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-transcripts-review',
  templateUrl: './transcripts-review.component.html',
  styleUrls: ['./transcripts-review.component.scss']
})
export class TranscriptsReviewComponent implements OnInit {
  @Input() contentTranscript;
  public transcripts = [];

  constructor(public resourceService: ResourceService) { }

  ngOnInit(): void {
    this.setTranscripts();
  }

  setTranscripts() {
    this.transcripts = this.contentTranscript || [];
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
    }
  }

}
