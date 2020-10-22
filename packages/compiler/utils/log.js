const formatMessages = require('webpack-format-messages');
const gutil = require('gutil');
const moment = require('moment');

const log = (compilation) => {
  const stats = compilation ? (compilation.stats || [compilation]) : [];

  stats.forEach((s) => {
    const messages = formatMessages(s);
    const duration = moment.duration(s.endTime - s.startTime, 'milliseconds');
    gutil.log('[COMPILE]', `${duration.minutes()}:${duration.seconds()} minutes`);

    if (!messages.errors.length) {
      console.log('Compiled successfully!');
    }

    if (messages.errors.length) {
      console.log('Failed to compile.');
      messages.errors.forEach(e => console.log(e));
    }
  });
};

module.exports = log;
