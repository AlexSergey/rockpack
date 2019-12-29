import { isValidElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Jed from 'jed';
import { isFunction } from 'valid-types';
import jed from './i18n';

function translateSprintf(...args) {
    return Jed.sprintf.apply(this, args);
}

function translateL(text, context) {
    if (!jed.getJed()) {
        return false;
    }
    return context ?
        jed.getJed().pgettext(context, text) :
        jed.getJed().gettext(text);
}

function translateNl(singular, plural, amount, context) {
    if (!Number.isInteger(amount)) {
        return singular;
    }
    if (!jed.getJed()) {
        return false;
    }

    return context ?
        jed.getJed().npgettext(context, singular, plural, amount) :
        jed.getJed().ngettext(singular, plural, amount);
}

const l = (text, context) => () => translateL(text, context);

const nl = (singular, plural, amount, context) => () => translateNl(singular, plural, amount, context);

const sprintf = (...args) => () => (
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
