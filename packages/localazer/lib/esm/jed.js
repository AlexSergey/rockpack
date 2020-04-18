import { isValidElement } from 'react';
import { isFunction } from 'valid-types';
import { renderToStaticMarkup } from 'react-dom/server';
import i18n from './i18n';
const translateSprintf = (...args) => i18n.sprintf.apply(i18n, args);
const translateL = (text, context) => (context ?
    i18n.pgettext(context, text) :
    i18n.gettext(text));
const translateNl = (singular, plural, amount, context) => (context ?
    i18n.npgettext(context, singular, plural, amount) :
    i18n.ngettext(singular, plural, amount));
const l = (text, context) => () => translateL(text, context);
const nl = (singular, plural, amount, context) => () => translateNl(singular, plural, amount, context);
const sprintf = (...args) => () => (translateSprintf(...args.map(item => {
    if (isValidElement(item)) {
        return renderToStaticMarkup(item);
    }
    else if (isFunction(item)) {
        return item();
    }
    return item;
})));
export { l, nl, sprintf };
