const { handler: jobPostingHandler } = require('./job-posting');

exports.handler = async (event = {}) => {
  return jobPostingHandler({
    ...event,
    httpMethod: 'GET',
  });
};
