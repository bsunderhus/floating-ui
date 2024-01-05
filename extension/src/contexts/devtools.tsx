/**
 * chrome is a global variable injected by the browser
 * in extension environment https://developer.chrome.com/docs/extensions
 * it's usage should be limited to this file
 */
/* eslint no-restricted-globals: ["off", "chrome"] */

import * as React from 'react';

import type {ReferenceId} from '../types';
import {CONTROLLER, ELEMENT_METADATA} from '../utils/constants';
import themes from "../styles/themes.module.css";

export type DevtoolsContextValue = {
  inspectByReferenceId: (referenceId: ReferenceId) => Promise<void>;
  inspectDocument: () => Promise<void>;
  debug: () => Promise<void>;
  reloadInspectedWindow: () => void;
  dangerouslyEvalInspectedWindow: <Result>(
    expression: string,
  ) => Promise<Result | void>;
  onSelectionChanged: Pick<
    chrome.devtools.panels.SelectionChangedEvent,
    'addListener' | 'removeListener'
  >;
  onMessage: Pick<
    chrome.runtime.ExtensionMessageEvent,
    'addListener' | 'removeListener'
  >;
  theme: typeof chrome.devtools.panels.themeName;
  error: unknown;
};

const noop = () => {
  console.log('noop');
};
const noopp = async () => {
  console.log('noopp');
};
export const devtoolsDefaultContextValue: DevtoolsContextValue = {
  inspectByReferenceId: noopp,
  debug: noopp,
  reloadInspectedWindow: noop,
  dangerouslyEvalInspectedWindow: noopp,
  inspectDocument: noopp,
  onSelectionChanged: {
    addListener: noop,
    removeListener: noop,
  },
  onMessage: {
    addListener: noop,
    removeListener: noop,
  },
  theme: 'default',
  error: undefined,
};

const DevtoolsContext = React.createContext<DevtoolsContextValue>(
  devtoolsDefaultContextValue,
);

export const DevtoolsProvider = React.memo(
  (props: React.ProviderProps<DevtoolsContextValue>) => (
    <DevtoolsContext.Provider {...props}>
      <div className={themes[props.value.theme]}>{props.children}</div>
    </DevtoolsContext.Provider>
  ),
);

export const useDevtools = () => React.useContext(DevtoolsContext);

export const useChromeDevtoolsContextValue = (): DevtoolsContextValue => {
  const [error, setError] = React.useState<unknown>(undefined);
  return {
    error,
    onSelectionChanged: chrome.devtools.panels.elements.onSelectionChanged,
    onMessage: chrome.runtime.onMessage,
    theme: chrome.devtools.panels.themeName,
    inspectDocument: React.useCallback(async () => {
      await evalInspectedWindow<void>(`void inspect($0.ownerDocument);`).catch(
        setError,
      );
    }, []),
    dangerouslyEvalInspectedWindow: React.useCallback(
      <Result,>(expression: string) =>
        evalInspectedWindow<Result>(expression).catch(setError),
      [],
    ),
    debug: React.useCallback(async () => {
      evalInspectedWindow<void>(
        `void setTimeout(() => {debugger;}, 2000);`,
      ).catch(setError);
    }, []),
    inspectByReferenceId: React.useCallback(async (referenceId) => {
      evalInspectedWindow<void>(
        `void inspect($0.ownerDocument.defaultView['${CONTROLLER}'].selectedElement['${ELEMENT_METADATA}'].references.get('${referenceId}'));`,
      ).catch(setError);
    }, []),
    reloadInspectedWindow: chrome.devtools.inspectedWindow.reload,
  };
};

/**
 * Evaluates an expression in the context of the inspected page
 */
const evalInspectedWindow = <Result,>(expression: string): Promise<Result> =>
  new Promise((resolve, reject) =>
    chrome.devtools.inspectedWindow.eval<Result>(
      expression,
      {},
      (result, error) => (error ? reject(error) : resolve(result)),
    ),
  );

export type ChromeEvaluationException = Pick<
  chrome.devtools.inspectedWindow.EvaluationExceptionInfo,
  'value' | 'isException'
>;

export type ChromeEvaluationError = Pick<
  chrome.devtools.inspectedWindow.EvaluationExceptionInfo,
  'description' | 'isError'
>;

export const isChromeEvaluationException = (
  error: unknown,
): error is ChromeEvaluationException =>
  typeof error === 'object' &&
  error !== null &&
  'isException' in error &&
  error.isException === true;

export const isChromeEvaluationError = (
  error: unknown,
): error is ChromeEvaluationError =>
  typeof error === 'object' &&
  error !== null &&
  'isError' in error &&
  error.isError === true;
