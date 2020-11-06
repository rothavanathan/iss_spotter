const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};


const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ip-api.com/json/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const coords = {};
  coords.latitude = JSON.parse(body).lat;
  coords.longitude = JSON.parse(body).lon;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`);
};

const printPassTimes = function(body) {
  const passTimes = JSON.parse(body);
  for (const pass of passTimes.response) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

const nextISSTimesForMyLocation = function() {
  fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(printPassTimes)
    .catch((error) => {
      console.log("It didn't work: ", error.message);
    });
};

module.exports = { nextISSTimesForMyLocation };