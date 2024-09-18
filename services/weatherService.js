const axios = require('axios');

const getWeatherData = async (location) => {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=f6301c73e4938f20493c13b317cbd421`;
    const response = await axios.get(weatherApiUrl);
    return response.data;
};

const getEarthquakeData = async () => {
    const earthquakeApiUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=now-1hour';
    const response = await axios.get(earthquakeApiUrl);
    return response.data;
};

const getHurricaneData = async (location) => {
    const hurricaneApiUrl = `https://api.weatherapi.com/v1/current.json?key=baa37b6a79d54894ac3220400241709&q=${encodeURIComponent(location)}&alerts=yes`;
    const response = await axios.get(hurricaneApiUrl);
    return response.data;
};

module.exports = {
    getWeatherData,
    getEarthquakeData,
    getHurricaneData,
};