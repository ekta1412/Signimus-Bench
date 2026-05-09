const { handler: addProfileHandler } = require('./add-profile');
const { handler: getProfilesHandler } = require('./get-profiles');

exports.handler = async (event = {}) => {
  if (event.httpMethod === 'GET' || event.httpMethod === 'OPTIONS') {
    return getProfilesHandler(event);
  }

  if (event.httpMethod === 'POST') {
    return addProfileHandler(event);
  }

  return {
    statusCode: 405,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    },
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
