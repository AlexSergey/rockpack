const codeParser = require('./codeParser');
const { isArray } = require('valid-types');
const { normalize, clearDoubles } = require('../utils');

function getAllLocalizationData(options) {
    return new Promise(async function (resolve, reject) {
        let dict = {};
        for (let i = 0, l = options.src.length; i < l; i++) {
            try {
                let sentences = await codeParser(options.src[i], options);
                if (isArray(sentences) && sentences.length > 0) {
                    dict[options.src[i]] = sentences;
                }
            } catch (err) {
                return reject(err);
            }
        }
        dict = normalize(clearDoubles(dict));
        resolve(dict);
    });
}

module.exports = getAllLocalizationData;