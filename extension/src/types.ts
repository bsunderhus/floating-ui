import type {ReferenceElement} from '@floating-ui/dom';

import type {
  HTML_ELEMENT_REFERENCE,
  SERIALIZED_DATA_CHANGE,
} from './utils/constants';

export type Serialized<T> = T extends (infer R)[]
  ? Serialized<R>[]
  : T extends (...args: any[]) => any
    ? never
    : T extends ReferenceElement
      ? ReferenceId
      : T extends object
        ? {[P in keyof T]: Serialized<T[P]>}
        : T;

export type ReferenceId = `${typeof HTML_ELEMENT_REFERENCE}:${string}`;

export type SerializedDataChangeMessage = typeof SERIALIZED_DATA_CHANGE