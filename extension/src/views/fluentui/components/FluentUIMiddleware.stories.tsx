import type {Meta, StoryObj} from '@storybook/react';

import {HTML_ELEMENT_REFERENCE} from '../../../utils/constants';
import {serializedDataDecorator} from '../../../utils/decorators';
import {fluentDecorator} from '../../../utils/decorators';
import {FluentUIMiddleware} from './FluentUIMiddleware';

const dummyReferenceId =
  `${HTML_ELEMENT_REFERENCE}:${crypto.randomUUID()}` as const;

export default {
  title: 'Views/Fluent UI/Middleware',
  parameters: {
    layout: 'centered',
  },
  decorators: [fluentDecorator()],
  component: FluentUIMiddleware,
} satisfies Meta<typeof FluentUIMiddleware>;

export const Middleware: StoryObj<typeof FluentUIMiddleware> = {
  decorators: [
    serializedDataDecorator(
      Array.from({length: 10}, (_, index) => ({
        type: 'FluentUIMiddleware',
        middlewareState: {
          elements: {
            floating: dummyReferenceId,
            reference: dummyReferenceId,
          },
          x: index,
          y: index,
          strategy: 'absolute',
          rects: {
            floating: {x: index, y: index, width: 100, height: 100},
            reference: {x: 0, y: 0, width: 0, height: 0},
          },
          placement: 'bottom',
          initialPlacement: 'bottom-end',
          middlewareData: {},
        },
        flipBoundaries: [dummyReferenceId, dummyReferenceId],
        scrollParents: [dummyReferenceId],
        overflowBoundaries: [dummyReferenceId],
        options: {},
        initialPlacement: {position: 'unknown', alignment: 'unknown'},
        placement: {position: 'unknown', alignment: 'unknown'},
      })),
    ),
  ],
};
