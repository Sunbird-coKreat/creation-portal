import { Injectable } from '@angular/core';

/**
 * Service to show toaster
 *
 */
@Injectable()
export class ToasterService {

  /**
   * To show toaster messages
   */
  private iziToast: any;
  private options = {
    position: 'topCenter',
    titleSize: '18',
    timeout: 6000,
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX'
  };
  /**
	 * Constructor to create injected service(s) object
	 */
  constructor() {
    this.iziToast = iziToast; // global object
  }
  /**
   * Format success message
   * @memberOf Services.toasterService
   * @param {string}  message - Success message
   */
  success(title: string, message?: string) {
    this.iziToast.success({
      title: title,
      message: message ? message : '',
      class: 'sb-toaster sb-toast-normal sb-toast-success',
      ...this.options
    });
  }

  /**
   * Format information message
   * @memberOf Services.toasterService
   * @param {string}  message - Info message
   */
  info(title: string, message?: string) {
    this.iziToast.info({
      title: title,
      message: message ? message : '',
      class: 'sb-toaster sb-toast-normal sb-toast-info',
       ...this.options
    });
  }

  /**
   * Format error message
   * @memberOf Services.toasterService
   * @param {string}  message - Error message
   */
  error(title: string, message?: string) {
    this.iziToast.error({
      title: title,
      message: message ? message : '',
      class: 'sb-toaster sb-toast-normal sb-toast-danger',
       ...this.options
    });
  }

  /**
   * Format warning message
   * @memberOf Services.toasterService
   * @param {string}  message - Warning message
   */
  warning(title: string, message?: string) {
    this.iziToast.warning({
      title: title,
      message: message ? message : '',
      class: 'sb-toaster sb-toast-normal sb-toast-warning',
       ...this.options
    });
  }
}
