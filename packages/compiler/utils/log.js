const gutil = require('gutil');
const moment = require('moment');

const log = (err, stats) => {
    if (stats.hasErrors()) {
        console.log(stats.toString({
            "errors-only": true,
            colors: true,
            children: false
        }));
    }
    else {
        let duration = moment.duration(stats.endTime - stats.startTime, 'milliseconds');
        gutil.log('[COMPILE]', `${duration.minutes()}:${duration.seconds()} minutes`);
    }
};

module.exports = log;