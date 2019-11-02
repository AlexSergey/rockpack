import Jed from 'jed';
import { isFunction } from 'valid-types';
import jed from './i18n';

const l = (text, context) => {
    return function () {
        return translateL(text, context);
    };
};
const nl = (singular, plural, amount, context) => {
    return function () {
        return translateNl(singular, plural, amount, context);
    };
};
const sprintf = (...args) => {
    return function () {
        return translateSprintf.apply(null, args.map(item => (isFunction(item) ? item() : item)));
    };
};

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

export { l, nl, sprintf };
