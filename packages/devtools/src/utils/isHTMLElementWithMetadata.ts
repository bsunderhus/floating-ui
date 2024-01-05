import {ELEMENT_METADATA} from 'extension/utils/constants';

import type {HTMLElementWithMetadata, MiddlewareMetadata} from '../types';

export const isHTMLElementWithMetadata = (
  element?: HTMLElement | null,
): element is HTMLElementWithMetadata & {parentElement: HTMLElement} =>
  Boolean(
    element && ELEMENT_METADATA in element && element.parentElement !== null,
  );
