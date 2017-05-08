/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

export class HTMLCommentSerializer {
  HTML_ELEMENT_REGEXP = /Comment/;
  public test = value =>
    value !== undefined &&
    value !== null &&
    value.nodeType === 8 &&
    value.constructor !== undefined &&
    this.HTML_ELEMENT_REGEXP.test(value.constructor.name);

  public print = () => '';
}
