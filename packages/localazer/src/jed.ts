import { isValidElement, ReactElement } from 'react';
import { isFunction } from 'valid-types';
import { renderToStaticMarkup } from 'react-dom/server';
import i18n from './i18n';

export type LInterfae = (text: string, context: string) => () => string;
export type NLInterfae = (singular: string, plural: string, amount: number|string, context: string) => () => string;
type JEDSprintFArguments = string | number | undefined;

type SprintFArguments = (...args: any[]) => any | ReactElement<any> | string | number | undefined;

export type SprintFInterface = (args: SprintFArguments) => () => string;

const translateSprintf = (...args: JEDSprintFArguments[]): string => i18n.sprintf.apply(i18n, args);

const translateL = (text: string, context: string): string => (
  context ?
    i18n.pgettext(context, text) :
    i18n.gettext(text)
);

const translateNl = (singular: string, plural: string, amount: number | string, context: string): string => (
  context ?
    i18n.npgettext(context, singular, plural, amount) :
    i18n.ngettext(singular, plural, amount)
);

const l: LInterfae = (text, context) => () => translateL(text, context);

const nl: NLInterfae = (singular, plural, amount, context) => () => translateNl(singular, plural, amount, context);

const sprintf: SprintFInterface = (...args) => () => (
  translateSprintf(
    ...args.map(item => {
      if (isValidElement(item)) {
        return renderToStaticMarkup(item);
      } else if (isFunction(item)) {
        return item();
      }
      return item;
    })
  )
);

export { l, nl, sprintf };
