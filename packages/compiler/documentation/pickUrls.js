const { isString } = require('valid-types');

const pickUrls = (children, fill) => {
    if (!children) {
        return fill;
    }
    if (Array.isArray(children)) {
        children.forEach(c => pickUrls(c, fill));
    }
    if (isString(children.url)) {
        fill.push(children.url);
    }
    if (children.children) {
        pickUrls(children.children, fill);
    }
    return fill;
};

module.exports = pickUrls;
