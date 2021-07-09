import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash-es';
import { DialcodeCursor } from 'common-form-elements-v9';
import { ConfigService } from '../config/config.service';
import { PublicDataService } from '../public-data/public-data.service';
import { TreeService } from '../../services/tree/tree.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DialcodeService implements DialcodeCursor {

  public invaliddialCodeMap = {};
  public dialCodeMap = {};
  public dialcodeList = [];
  private maxChar = 6;
  constructor(public configService: ConfigService, private publicDataService: PublicDataService,
              private treeService: TreeService, private toasterService: ToasterService) { }

  reserveDialCode(indetifier, requestCount): Observable<any> {
    const req = {
      url: this.configService.urlConFig.URLS.DIALCODE.RESERVE + indetifier,
      data: {
        request: {
          dialcodes: {
            count: requestCount,
            qrCodeSpec: {
              errorCorrectionLevel: 'H'
            }
          }
        }
      }
    };
    return this.publicDataService.post(req);
  }

  linkDialcode(indetifier, dialcodes): Observable<any> {
    const req = {
      url: this.configService.urlConFig.URLS.DIALCODE.LINK + indetifier,
      data: {
        request: {
          content: dialcodes
        }
      }
    };
    return this.publicDataService.post(req);
  }

  downloadQRCode(processId): Observable<any> {
    const req = {
      url: this.configService.urlConFig.URLS.DIALCODE.PROCESS + processId,
    };
    return this.publicDataService.get(req);
  }

  searchDialCode(dialcode): Observable<any> {
    const req = {
      url: this.configService.urlConFig.URLS.DIALCODE.SEARCH,
      data: {
        request: {
          search: {
            identifier: dialcode,
          }
        }
      }
    };
    return this.publicDataService.post(req);
  }

  updateDialCode(dialcode): Observable<any> {
    if (!_.isEmpty(dialcode)) {
      dialcode = _.isArray(dialcode) ? dialcode[0] : dialcode;
      const editFlag = (dialcode && (dialcode.length === this.maxChar)) ? true : false;
      if (_.indexOf(this.dialcodeList, dialcode) !== -1) {
        return of({ isEditable: editFlag, isValid: true });
      } else {
        return this.searchDialCode(dialcode).pipe(map(response => {
          if (response.result.count) {
            _.uniq(this.dialcodeList.push(response.result.dialcodes[0].identifier));
            return { isEditable: editFlag, isValid: true };
          } else {
            return { isEditable: editFlag, isValid: false };
          }
        }));
      }
    } else {
      return of({ isEditable: false });
    }
  }

  clearDialCode() {
    const currentNode = this.treeService.getActiveNode().data;
    if (_.has(this.invaliddialCodeMap, currentNode.id)) { _.unset(this.invaliddialCodeMap, currentNode.id); }
    if (_.has(this.dialCodeMap, currentNode.id)) { _.unset(this.dialCodeMap, currentNode.id); }
    if (currentNode.metadata && currentNode.metadata.dialcodes === null) {
      if (this.treeService.treeCache.nodesModified && this.treeService.treeCache.nodesModified[currentNode.id]) {
        this.treeService.treeCache.nodesModified[currentNode.id].metadata.dialcodes = [];
      }
      this.dialCodeMap[currentNode.id] = '';
      currentNode.metadata.dialcodes = null;
    }
    this.treeService.nextTreeStatus('modified');
  }

  changeDialCode(dialcode) {
    const currentNode = this.treeService.getActiveNode().data;
    if (_.isEmpty(dialcode)) {
      if (_.has(this.invaliddialCodeMap, currentNode.id)) { _.unset(this.invaliddialCodeMap, currentNode.id); }
      if (_.has(this.dialCodeMap, currentNode.id)) { _.unset(this.dialCodeMap, currentNode.id); }
      if (currentNode.metadata && currentNode.metadata.dialcodes && currentNode.metadata.dialcodes.length) {
        if (this.treeService.treeCache.nodesModified && this.treeService.treeCache.nodesModified[currentNode.id]) {
          this.treeService.treeCache.nodesModified[currentNode.id].metadata.dialcodes = [];
        }
        this.dialCodeMap[currentNode.id] = '';
        currentNode.metadata.dialcodes = null;
      }
      this.treeService.nextTreeStatus('modified');
    }
  }

  validateDialCode(dialcode): Observable<any> {
    if (this.checkDuplicateDialCode(dialcode)) {
      return of({ isEditable: true, isValid: false, statusMsg: 'Duplicate QR code' });
    } else if (String(dialcode).match(/^[A-Z0-9]{2,}$/)) {
      const node = this.treeService.getActiveNode();
      if (this.treeService.treeCache.nodesModified && this.treeService.treeCache.nodesModified[node.data.id]) {
        this.treeService.treeCache.nodesModified[node.data.id].metadata.dialcodes = _.castArray(dialcode);
      }
      if (_.indexOf(this.dialcodeList, dialcode) !== -1) {
        if (_.has(this.invaliddialCodeMap, node.data.id)) { _.unset(this.invaliddialCodeMap, node.data.id); }
        this.dialCodeMap[node.data.id] = dialcode;
        node.data.metadata.dialcodes = dialcode;
        this.treeService.nextTreeStatus('modified');
        return of({ isEditable: true, isValid: true });
      } else {
        return this.searchDialCode(dialcode).pipe(map(response => {
          if (response.result.count) {
            _.uniq(this.dialcodeList.push(dialcode));
            if (_.has(this.invaliddialCodeMap, node.data.id)) { _.unset(this.invaliddialCodeMap, node.data.id); }
            this.dialCodeMap[node.data.id] = dialcode;
            node.data.metadata.dialcodes = dialcode;
            this.treeService.nextTreeStatus('modified');
            return { isEditable: true, isValid: true };
          } else {
            if (_.has(this.dialCodeMap, node.data.id)) { _.unset(this.dialCodeMap, node.data.id); }
            this.invaliddialCodeMap[node.data.id] = dialcode;
            node.data.metadata.dialcodes = dialcode;
            this.treeService.nextTreeStatus('modified');
            return { isEditable: true, isValid: false };
          }
        }));
      }
    } else {
      return of({ isEditable: false });
    }
  }

  checkDuplicateDialCode(activeQRCode) {
    const getAllNodes = this.treeService.getTreeObject();
    const findValuesDeepByKey = (obj, key, res = []) => (
      // tslint:disable-next-line:no-unused-expression
      _.cloneDeepWith(obj, (v, k) => { k === key && res.push(v); }) && res
    );
    const dialcodeArray = _.flattenDeep(findValuesDeepByKey(getAllNodes, 'dialcodes'));
    if (_.includes(dialcodeArray, activeQRCode)) {
      return true;
    }
    return false;
  }

  validateUnitsDialcodes() {
    let dialCodeMisssing = false;
    const rootNode = this.treeService.getTreeObject();
    let dialcodes;
    rootNode.visit((node) => {
      dialcodes = node.data.metadata.dialcodes;
      const unitDialCode = _.isArray(dialcodes) ? dialcodes[0] : dialcodes;
      if (node.data.metadata.dialcodeRequired === 'Yes' && !_.includes(this.dialcodeList, unitDialCode)) {
        dialCodeMisssing = true;
        this.treeService.highlightNode(node.data.id, 'add');
      } else if (node.data.metadata.dialcodeRequired === 'Yes' && _.isEmpty(dialcodes)) {
        dialCodeMisssing = true;
        this.treeService.highlightNode(node.data.id, 'add');
      } else if (node.data.metadata.dialcodeRequired === 'No' && !_.isEmpty(dialcodes)) {
        dialCodeMisssing = true;
        this.treeService.highlightNode(node.data.id, 'add');
      }
    });
    if (dialCodeMisssing) {
      return false;
    } else {
      return true;
    }
  }

  highlightNodeForInvalidDialCode(res, nodesModified, indetifier) {
    const mapArr = [];
    _.forEach(this.invaliddialCodeMap, (value, key) => {
      if (_.has(res.identifiers, key)) {
        delete this.invaliddialCodeMap[key];
        this.invaliddialCodeMap[res.identifiers[key]] = value;
        this.treeService.highlightNode(res.identifiers[key], 'add');
        this.storeDialCodes(res.identifiers[key], value);
      } else {
        this.storeDialCodes(key, value);
        this.treeService.highlightNode(key, 'add');
      }
    });
    _.forEach(this.dialCodeMap, (value, key) => {
      if (_.has(res.identifiers, key)) {
        delete this.dialCodeMap[key];
        this.dialCodeMap[res.identifiers[key]] = value;
        mapArr.push({ identifier: res.identifiers[key], dialcode: value });
        this.treeService.highlightNode(res.identifiers[key], 'remove');
        this.storeDialCodes(res.identifiers[key], value);
      } else {
        mapArr.push({ identifier: key, dialcode: value });
        this.storeDialCodes(key, value);
        this.treeService.highlightNode(key, 'remove');
      }
    });
    let dialcodesUpdated = false;
    _.forIn(nodesModified, (node) => {
      if ((node.metadata.dialcodes || node.metadata.dialcodes === null) && !dialcodesUpdated) {
        dialcodesUpdated = true;
      } else {
        const dialObj = _.find(mapArr, (Obj) => {  // check this: not required
          return Obj.identifier === res.content_id;
        });
        if (!_.isUndefined(dialObj)) {
          dialcodesUpdated = true;
        }
      }
    });
    if (dialcodesUpdated) {
      this.dialcodeLink(mapArr, indetifier);
    }
  }

  storeDialCodes(nodeId, dialCode) {
    const node = this.treeService.getNodeById(nodeId);
    if (node && node.data) {
      node.data.metadata.dialcodes = dialCode;
    }
  }

  dialcodeLink(dialcodeMap, indetifier) {
    if (!_.isEmpty(dialcodeMap)) {
      this.linkDialcode(indetifier, dialcodeMap).subscribe((res) => {
        if ( !_.isEmpty(this.dialCodeMap) && !_.isEmpty(this.invaliddialCodeMap)) {
          this.toasterService.warning(_.get(this.configService, 'labelConfig.messages.warning.002'));
        } else {
          this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.009'));
        }
        }, (err) => {
          if (err && err.error && err.error.params && err.error.params.err === 'ERR_DIALCODE_LINK') {
            this.toasterService.error(err.error.params.errmsg);
        } else {
            this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.012'));
        }
      });
    } else if (!_.isEmpty(this.invaliddialCodeMap)) {
      this.toasterService.warning(_.get(this.configService, 'labelConfig.messages.warning.002'));
    }
  }

}
