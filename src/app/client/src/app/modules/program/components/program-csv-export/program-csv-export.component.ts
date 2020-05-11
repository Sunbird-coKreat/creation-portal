import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProgramSearchService } from '../../services/program-search/program-search.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-program-csv-export',
  templateUrl: './program-csv-export.component.html',
  styleUrls: ['./program-csv-export.component.scss']
})
export class ProgramCsvExportComponent implements OnInit {
  program_id: string;
  tableData: Array<any>;
  collectionList: Array<any>;
  nominationResponse: Array<any>;
  contributionResponse: Array<any>;
  sampleContentResponse: Array<any>;
  errorMsg: string;
  @Output() sendTableData = new EventEmitter<any>();

  constructor(public programSearchService: ProgramSearchService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  this.program_id = this.activatedRoute.snapshot.params.programId;
  const requests = [this.programSearchService.getCollectionWithProgramId({status: ['Review', 'Draft'], programId: this.program_id}),
                    this.programSearchService.getSampleContentWithProgramId({status: ['Review', 'Draft'], programId: this.program_id}),
                  this.programSearchService.getContributionWithProgramId({status: ['Review', 'Draft', 'Live'], programId: this.program_id}),
                      this.programSearchService.getNominationWithProgramId(this.program_id)];
  setTimeout(() => {
    forkJoin(requests).subscribe((data) => {
      this.collectionList = data[0].result.content || [];
      this.sampleContentResponse = data[1].result.facets || [];
      this.contributionResponse = data[2].result.facets || [];
      this.nominationResponse = data[3].result || [];
      this.prepareTableData();
    }, (err) => {
      this.sendTableData.emit('error in exporting CSV');
    });
  });
  }

  prepareTableData () {
    try {
    if (this.collectionList.length) {
      this.tableData = _.map(this.collectionList, (collection) => {
        const result = {};
        // sequence of columns in tableData
        result['Textbook Name'] = collection.name;
        result['Medium'] = collection.medium;
        result['Class'] = collection.gradeLevel.join(', ') || '';
        result['Subject'] = collection.subject;
        result['Number of Chapters'] = collection.chapterCount || '--';
        result['Nominations Received'] = 0;
        result['Samples Received'] = 0;
        result['Nominations Accepted'] = 0;
        result['Contributions Received'] = 0;
        result['Contributions Accepted'] = collection.acceptedContents ? collection.acceptedContents.length : 0;
        result['Contributions Rejected'] = collection.rejectedContents ? collection.rejectedContents.length : 0;
        result['Contributions Pending'] = 0;

        // count of sample contents
        if (this.sampleContentResponse.length) {
          const facetObj = _.find(this.sampleContentResponse, {name: 'collectionId'});
          if (facetObj && facetObj.values.length &&
            _.find(facetObj.values, {name: collection.identifier})) {
              result['Samples Received'] = _.find(facetObj.values, {name: collection.identifier}).count;
          }
        }
        // count of contribution
        if (this.contributionResponse.length && this.contributionResponse[0].name === 'status'
             && this.contributionResponse[0].values.length) {
               _.forEach(this.contributionResponse[0].values, (obj) => {
                if (obj.name === 'live') {
                  result['Contributions Received'] = result['Contributions Received'] + obj.count;
                  // tslint:disable-next-line:max-line-length
                  result['Contributions Pending'] = result['Contributions Received'] - (result['Contributions Rejected'] + result['Contributions Accepted']);
                }
               });
        }

        // count of nomination
        if (this.nominationResponse.length) {
         _.forEach(this.nominationResponse, (obj) => {
           if (obj.collection_ids && _.includes(obj.collection_ids, collection.identifier) ) {
              if (obj.status === 'Approved') {
                result['Nominations Accepted'] = result['Nominations Accepted'] + Number(obj.count);
              } else if (obj.status !== 'Initiated') {
                result['Nominations Received'] = result['Nominations Received'] + Number(obj.count);
              }
           }
         });
         result['Nominations Received'] = result['Nominations Accepted'] + result['Nominations Received'];
        }
        return result;
      });
    }
    this.sendTableData.emit(this.tableData);
  } catch (err) {
    console.log('error in prepareCSV', err);
    this.sendTableData.emit('error in exporting CSV');
  }
  }
}
