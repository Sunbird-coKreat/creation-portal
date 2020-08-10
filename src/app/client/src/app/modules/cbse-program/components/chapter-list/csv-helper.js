(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(require('papaparse'), require('lodash/uniqBy'), require('lodash/isFunction'), require('famulus/isValuesUnique'))
        : typeof define === 'function' && define.amd 
            ? define(['papaparse', 'lodash/uniqBy', 'lodash/isFunction', 'famulus/isValuesUnique'], factory)
            : (global.myBundle = factory(global.Papa,global._uniqBy,global._isFunction, global.isValuesUnique));
}(this, (function (Papa, _uniqBy, _isFunction, isValuesUnique) {
    'use strict';

    Papa = Papa && Papa.hasOwnProperty('default') ? Papa['default'] : Papa;
    isValuesUnique = isValuesUnique && isValuesUnique.hasOwnProperty('default') ? isValuesUnique['default'] : isValuesUnique;
    _uniqBy = _uniqBy && _uniqBy.hasOwnProperty('default') ? _uniqBy['default'] : _uniqBy;
    _isFunction = _isFunction && _isFunction.hasOwnProperty('default') ? _isFunction['default'] : _isFunction;

    /**
     * @param {File} csvFile 
     * @param {Object} config 
     */
    function CSVFileValidator(csvFile, config) {
        return new Promise(function(resolve, reject) {
            Papa.parse(csvFile, {
                complete: function(results) {
                    resolve(_prepareDataAndValidateFile(results.data, config));
                },
                error: function(error, file) {
                    reject({ error: error, file: file });
                }
            });
        })
    }

    /**
     * @param {Array} csvData 
     * @param {Object} config 
     * @private
     */
    function _prepareDataAndValidateFile(csvData, config) {
        const file = {
            inValidMessages: [],
            data: []
        };

        // one row for headers and one empty blank row at last
        const actualRows = csvData.length - 2;
        if (actualRows === 0) {
            if (_isFunction(config.noRowsError)) {
                config.noRowsError()
            } else {
                file.inValidMessages.push(
                    String(`Empty rows found in the file`)
                );
            }
            return file;
        }

        if (config.minRows && (config.minRows > 0 && (config.minRows > actualRows))) {
            if (_isFunction(config.minRowsError)) {
                config.minRowsError(config.minRows, actualRows)
            } else {
                file.inValidMessages.push(
                    String(`Expected min ${minRows} rows but found ${actualRows} rows in the file`)
                );
            }
            return file;
        }

        if (config.maxRows && (config.maxRows > 0 && (config.maxRows < actualRows))) {
            if (_isFunction(config.maxRowsError)) {
                config.maxRowsError(config.maxRows, actualRows)
            } else {
                file.inValidMessages.push(
                    String(`Expected max ${maxRows} rows but found ${actualRows} rows in the file`)
                );
            }
            return file;
        }

        // header validation
        const csvHeaders = csvData[0];
        const headerNames = config.headers.map(row => row.name);
        let difference = headerNames
            .filter(x => !csvHeaders.includes(x))
            .concat(csvHeaders.filter(x => !headerNames.includes(x)));

        if (difference.length > 0) {
            difference.map((column) => {
                const valueConfig = config.headers.find(row => row.name === column);
                if (valueConfig) {
                    if (_isFunction(valueConfig.headerError)) {
                        valueConfig.headerError(column)
                    } else {
                        file.inValidMessages.push(
                            String('Header name ' + column + ' is missing')
                        );
                    }
                }
            });
            return file;
        }

        const uniqueValues = {};
        const groups = config.headers
            .filter((row) => row.group)
            .map(row => row.group)
            .filter((v, i, a) => a.indexOf(v) === i); 

        csvData.forEach(function(row, rowIndex) {
            // header so skip
            if (rowIndex === 0) return;
            
            // no more rows
            if ((row.length < config.headers.length)) {
                return ;
            }

            const columnData = {};
            const groupValues = {};

            config.headers.forEach(function(valueConfig, columnIndex) {
                if (!valueConfig) {
                    return;
                }

                const columnValue = (row[columnIndex] || '').trim();

                if (valueConfig.required && !columnValue.length) {
                    if (_isFunction(valueConfig.requiredError)) {
                        valueConfig.requiredError(valueConfig.name, rowIndex + 1, columnIndex + 1)
                    } else {
                        file.inValidMessages.push(
                            String(valueConfig.name + ' is required in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
                        );
                    }
                } else if (valueConfig.validate && !valueConfig.validate(columnValue)) {
                    if (_isFunction(valueConfig.validateError)) {
                        valueConfig.validateError(valueConfig.name, rowIndex + 1, columnIndex + 1)
                    } else {
                        file.inValidMessages.push(
                            String(valueConfig.name + ' is not valid in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
                        );
                    }
                }

                if (valueConfig.unique) {
                    if (!uniqueValues[valueConfig.inputName]) {
                        uniqueValues[valueConfig.inputName] = []
                    }
                    
                    if (!uniqueValues[valueConfig.inputName].includes(columnValue)) {
                        uniqueValues[valueConfig.inputName].push(columnValue);
                    } else {
                        if (_isFunction(valueConfig.uniqueError)) {
                            valueConfig.uniqueError(valueConfig.name, rowIndex + 1, columnIndex + 1, columnValue);
                        } else {
                            file.inValidMessages.push(
                                String(valueConfig.name + ' has duplicate value (' + columnValue +') in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
                            );
                        }
                    }
                }

                if (valueConfig.group) {
                    const group = valueConfig.group;
                    if (!groupValues[group]) {
                        groupValues[group] = [];
                    }
                    if (!groupValues[group][rowIndex]) {
                        groupValues[group][rowIndex] = [];
                    }
                    if (columnValue.length > 0) {
                        groupValues[group][rowIndex].push(columnValue);
                    }
                }

                if (valueConfig.optional) {
                    columnData[valueConfig.inputName] = columnValue;
                }

                if (valueConfig.isArray) {
                    columnData[valueConfig.inputName] = columnValue.split(',').map(function(value) { 
                        return value.trim();
                    });
                } else {
                    columnData[valueConfig.inputName] = columnValue;
                }
            });

            if (groups.length > 0) {
                groups.forEach(function(group) {
                    const values = groupValues[group][rowIndex];
                    if (!values.length) {
                        if (_isFunction(config.groupsError[group])) {
                            config.groupsError[group](group, rowIndex + 1)
                        } else {
                            file.inValidMessages.push(
                                String(group + ' has no value in the ' + (rowIndex + 1) + ' row')
                            );
                        }
                    }
                });
            }

            file.data.push(columnData);
        });

        

        //_checkUniqueFields(file, config);

        return file;
    }

    /**
     * @param {Object} file 
     * @param {Object} config
     * @private 
     */
    function _checkUniqueFields(file, config) {
        if (!file.data.length) {
            return;
        }

        config.headers
            .filter(function(header) {
                return header.unique
            })
            .forEach(function(header) {
                if (!isValuesUnique(file.data, header.inputName)) {
                    file.inValidMessages.push(
                        _isFunction(header.uniqueError)
                            ? header.uniqueError(header.name)
                            : String(header.name + ' is not unique')
                    );
                }
            });
    };

    return CSVFileValidator;
})));
