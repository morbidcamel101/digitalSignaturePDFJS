/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* globals PDFView, Promise, mozL10n, getPDFFileNameFromURL, OverlayManager */

'use strict';

var VerifySignature = {
  overlayName: null,
  certificationField: '',
  signatureField: '',
  finalField: '',

  initialize: function verifySignatureInitialize(options) {
    this.overlayName = options.overlayName;

    // Set the document property fields.
    this.certificationField = options.certificationField;
    this.signatureField = options.signatureField;
    this.finalField = options.finalField;

    // Bind the event listener for the Close button.
    if (options.closeButton) {
      options.closeButton.addEventListener('click', this.close.bind(this));
    }

    this.dataAvailablePromise = new Promise(function (resolve) {
      this.resolveDataAvailable = resolve;
    }.bind(this));

    OverlayManager.register(this.overlayName, this.close.bind(this));
  },

  getProperties: function verifySignatureGetProperties() {

    if (!OverlayManager.active) {
      // If the dialog was closed before dataAvailablePromise was resolved,
      // don't bother updating the properties.
       return;
    }    

    //console.log("Parte verify_sign: "+about_sign);

    // Get the other document properties.
    // only to get the print
    PDFView.pdfDocument.getMetadata().then(function(data) {
      var fields = [
        { field: this.signatureField, content: "Valid signature!" },
        { field: this.certificationField, content: "Valid Certificate!" },
        { field: this.finalField, content: "The authentication on this document is valid!" }
      ];

      // Show the properties in the dialog.
      for (var item in fields) {
        var element = fields[item];
        this.updateUI(element.field, element.content);
      }
    }.bind(this));
  },

  updateUI: function verifySignatureUpdateUI(field, content) {
    if (field && content !== undefined && content !== '') {
      field.textContent = content;
    }
  },

  open: function verifySignatureOpen() {
    Promise.all([OverlayManager.open(this.overlayName),
                 this.dataAvailablePromise]).then(function () {
      this.getProperties();
    }.bind(this));
  },

  close: function verifySignatureClose() {
    OverlayManager.close(this.overlayName);
  },

};



