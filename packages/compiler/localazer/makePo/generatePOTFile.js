const { writeFileSync } = require('fs');
const mergePOFiles = require('./mergePOFiles');
const { exec } = require('child_process');
const tempy = require('tempy');
const { normalize } = require('path');

function generatePOTFile(results, options) {
    return new Promise((resolve, reject) => {
        try {
            let dict = tempy.file();
            let list = tempy.file();
            writeFileSync(dict, results);
            writeFileSync(list, dict);

            exec(
                'xgettext' +
                ' --keyword="l:1"' +
                ' --keyword="l:1,2c"' +
                ' --keyword="nl:1,2"' +
                ' --keyword="nl:1,2,4c"' +
                ' --files-from="' +
                list +
                '"' +
                ' --language=JavaScript' +
                ' --no-location' +
                ' --from-code=UTF-8' +
                ' --output="' +
                normalize(options.dist + '/messages.pot') +
                '"',
                (err) => {
                    if (err) {
                        return reject(err);
                    }
                    mergePOFiles(options)
                        .then(resolve)
                        .catch(reject);
                }
            );
        } catch (err) {
            return reject(err);
        }
    });
}

module.exports = generatePOTFile;