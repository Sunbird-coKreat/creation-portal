import { Component, EventEmitter, Input, OnInit, Output, OnChanges, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataFormComponent implements OnInit {
  @Input() formFieldProperties: any;
  @Input() categoryMasterList: any;

  /**
   * formInputData is to take input data's from form
   */
  public formInputData = {};
  /**
   * categoryList is category list of dropdown values
   */
  public categoryList: {};

  constructor() {
    this.categoryList = {};
  }

  setFormConfig() {
    const DROPDOWN_INPUT_TYPES = ['select', 'multiSelect'];
    _.forEach(this.formFieldProperties, (field) => {
      if (_.includes(DROPDOWN_INPUT_TYPES, field.inputType)) {
        if (field.depends && field.depends.length) {
          this.getAssociations(this.categoryMasterList[field.code],
            field.range, (associations) => {
              this.applyDependencyRules(field, associations, false);
            });
        }
      }
      if (field.defaultValue) {
        field['default'] = field.defaultValue;
        this.formInputData[field.code] = field.defaultValue;
      }
    });
  }

  mapParents(data, callback) {
    // create parent to all the fields
    _.forEach(data, (val, index) => {
      data[index].parent = [];
    });

    // set parents
    _.forEach(data, (field, index) => {
      if (field.depends) {
        _.forEach(field.depends, (depend) => {
          _.forEach(data, (category, counter) => {
            if (depend === category.code) {
              data[counter].parent.push(field.code);
            }
          });

        });
      }
    });
    return callback(data);
  }

  ngOnInit() {
    this.formFieldProperties.forEach(formProperty => {
      if(formProperty.code == 'name') {
        formProperty.validation = [
          { type: "maxLength", value: "50", message: "Input is Exceeded"},
          {
            type: "required", message: "Name is required"
          }
      ];
      }
      if(formProperty.code == 'additionalCategories') {
        formProperty.inputType = 'nestedselect';
      }
      if(formProperty.code == 'contentPolicyCheck') {
        formProperty.dataType = 'boolean';
      }
    });
    this.mapParents(this.formFieldProperties, (data) => {
      this.formFieldProperties = data;
      this.setFormConfig();
      this.mapMasterCategoryList('');
    });
  }

  /**
  * @description            - Which is used to update the form when vlaues is get changes
  * @param {Object} object  - Field information
  */
  updateForm(object) {
    if (object.field.range) {
      this.getAssociations(object.value, object.field.range, (associations) => {
        this.getParentAssociations(object.field, associations, object.formData, (commonAssociations) => {
          this.applyDependencyRules(object.field, commonAssociations, true);
        });
      });
    }
  }


  getCommonAssociations(parentAssociations, childAssociations) {
    let intersectionData = [];
    if (parentAssociations && parentAssociations.length) {
      intersectionData = _.filter(parentAssociations, (e) => {
        return _.find(childAssociations, e);
      });
    }
    return intersectionData;
  }

  getParentAssociations(fields, associations, formData, callback) {
    if (fields.parent && fields.parent.length) {
      _.forEach(fields.parent, (val) => {
        _.forEach(this.formFieldProperties, (field) => {
          if (field.code === val) {
            _.forEach(field.range, (range) => {
              if (_.isArray(formData[val]) && formData[val].length > 0) {
                _.forEach(formData[val], (metadata) => {
                  if (range.name === metadata) {
                    associations = this.getCommonAssociations(range.associations, associations);
                  }
                });
              } else {
                if (range.name === formData[val]) {
                  associations = this.getCommonAssociations(range.associations, associations);
                }
              }
            });
          }
        });
      });
    }
    callback(associations);
  }

  /**
  * @description                    - Which is used to get the association object by mapping key and range object
  * @param {String | Array} keys    - To the associactio object for particular key's
  * @param {Object} range           - Which refers to framework terms/range object
  */
  getAssociations(keys, range, callback) {
    let names = [];
    const associations = [];
    const filteredAssociations = [];
    if (_.isString(keys)) {
      names.push(keys);
    } else {
      names = keys;
    }
    _.forEach(range, (res) => {
      _.forEach(names, (value, key) => {
        if (res.name === value) {
          filteredAssociations.push(res);
        }
      });
    });
    _.forEach(filteredAssociations, (val, index) => {
      if (val.associations) {
        _.forEach(val.associations, (key, value) => {
          associations.push(key);
        });
      }
    });
    if (callback) {
      callback(associations);
    }
  }

  /**
  * @description                    - Which is used to resolve the dependency.
  * @param {Object} field           - Which field need need to get change.
  * @param {Object} associations    - Association values of the respective field.
  * @param {Boolean} resetSelected  - @default true Which defines while resolving the dependency dropdown
  *                                   Should reset the selected values of the field or not
  */
  applyDependencyRules(field, associations, resetSelected) {
    // reset the depended field first
    // Update the depended field with associated value
    // Currently, supported only for the dropdown values
    let dependedValues = [];
    let groupdFields = [];
    if (field.depends && field.depends.length) {
      _.forEach(field.depends, (id) => {
        if (resetSelected) {
          this.resetSelectedField(id, field.range);
        }
        dependedValues = _.map(associations, i => _.pick(i, ['name', 'category']));
        if (dependedValues.length) {
          groupdFields = _.chain(dependedValues)
          .groupBy('category')
          .map((name, category) => ({ name, category }))
          .value();
          this.updateDropDownList(id, dependedValues);
        }
        if (groupdFields.length) {
          _.forEach(groupdFields, (value, key) => {
            this.updateDropDownList(value.category, _.map(value.name, i => _.pick(i, 'name')));
          });
        } else {
          this.updateDropDownList(id, []);
        }
      });
    }
  }

  /**
     * @description         - Which is used to restore the dropdown slected value.
     * @param {String} id   - To restore the specific dropdown field value
     */
    resetSelectedField(id, field) {
      this.formInputData[id] = '';
    }


    /**
  * @description            - Which updates the drop down value list
  *                         - If the specified values are empty then drop down will get update with master list
  * @param {Object} field   - Field which is need to update.
  * @param {Object} values  - Values for the field
  */
  updateDropDownList(fieldCode, values) {
    if (values.length) {
      this.categoryList[fieldCode] = _.unionBy(values, 'name');
    } else {
      this.mapMasterCategoryList(fieldCode);
    }
  }

  /**
  *
  * @description                     -
  * @param {Object} configurations   - Field configurations
  * @param {String} key              - Field uniq code
  */
  mapMasterCategoryList(key) {
    _.forEach(this.formFieldProperties, (field, value) => {
      if (key) {
        if (field.code === key) {
          this.categoryList[field.code] = field.range;
        }
      } else {
        if (field.range) {
          this.categoryList[field.code] = field.range;
        }
      }
    });
  }

  handleCheckboxData (event, code) {
    if ( event.target.checked ) {
      this.formInputData[code] = true;
    } else {
      this.formInputData[code] = false;
    }
  }

  valueChanges(event) {
    _.forEach(this.formFieldProperties, (field) => {
      _.forEach(event, (eventValue, eventKey) => {
          if (field['code'] == eventKey) {
            field['defaultValue'] = eventValue;
            this.formInputData[field.code] = field.defaultValue;
          }
      });
    });
    // todo : remove this console log later
    console.log('formInputData', this.formInputData);
  }

  outputData($event) {
  }

  onStatusChanges($event) {
  }
}
