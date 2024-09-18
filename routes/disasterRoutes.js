const express = require('express');
const { getWeatherData, getEarthquakeData, getHurricaneData } = require('../services/weatherService');
const { sendEmailAlert } = require('../services/emailService');

const router = express.Router();

module.exports = (io) => {
    // Flood route
    router.get('/check-flood', async (req, res) => {
        const location = req.query.location;
        try {
            const weatherData = await getWeatherData(location);
            const rainInLastHour = weatherData.rain && weatherData.rain['1h'] ? weatherData.rain['1h'] : 0;
            const isFlooded = rainInLastHour > 0.1;
            const { lat: latitude, lon: longitude } = weatherData.coord;

            io.emit('floodUpdate', { location, isFlooded });

            if (isFlooded) {
                const mapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=10`;
                const htmlContent = `
                    <p>Alert: Water logging has been detected in ${location}. Rainfall: ${rainInLastHour}mm in the last hour.</p>
                    <p>View the affected area on the map: <a href="${mapUrl}" target="_blank">OpenStreetMap</a></p>
                `;
                sendEmailAlert('gouravjio80@gmail.com', `Flood Alert: Water Logging in ${location}`, htmlContent);
            }

            res.json({ isFlooded });
        } catch (error) {
            console.error('Error fetching weather data:', error);
            res.status(500).json({ error: 'Failed to fetch flood data.' });
        }
    });

    // Earthquake route
    router.get('/check-earthquake', async (req, res) => {
        try {
            const earthquakeData = await getEarthquakeData();
            const recentEarthquake = earthquakeData.features[0];
            const { place: location, mag: magnitude } = recentEarthquake.properties;
            const [longitude, latitude] = recentEarthquake.geometry.coordinates;

            const isEarthquake = magnitude >= 1;

            io.emit('earthquakeUpdate', { location, magnitude, isEarthquake });

            if (isEarthquake) {
                const mapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=10`;
                const htmlContent = `
                    <p>Alert: An earthquake with magnitude ${magnitude} has been detected near ${location}. Please take immediate action.</p>
                    <p>View the affected area on the map: <a href="${mapUrl}" target="_blank">OpenStreetMap</a></p>
                `;
                sendEmailAlert('gauravjio50@gmail.com', `Earthquake Alert: Earthquake detected in ${location}`, htmlContent);
            }

            res.json({ location, magnitude, isEarthquake });
        } catch (error) {
            console.error('Error fetching earthquake data:', error);
            res.status(500).json({ error: 'Failed to fetch earthquake data.' });
        }
    });

    // Hurricane route
    router.get('/check-hurricane', async (req, res) => {
        const location = req.query.location;
        try {
            const weatherData = await getHurricaneData(location);
            const { alerts } = weatherData;
            const { lat: latitude, lon: longitude } = weatherData.location;

            if (alerts && alerts.alert) {
                const hurricaneAlert = alerts.alert;
                io.emit('hurricaneUpdate', { location, hurricaneAlert });

                const mapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=10`;
                const htmlContent = `
                    <p>Alert: A hurricane has been detected near ${location}. Please take immediate action and issue necessary warnings.</p>
                    <p>View the affected area on the map: <a href="${mapUrl}" target="_blank">OpenStreetMap</a></p>
                `;
                sendEmailAlert('gauravjio50@gmail.com', `Hurricane Alert: Hurricane detected near ${location}`, htmlContent);

                res.json({ isHurricane: true, hurricaneAlert });
            } else {
                res.json({ isHurricane: false, message: 'No hurricane alerts for this location.' });
            }
        } catch (error) {
            console.error('Error fetching hurricane data:', error);
            res.status(500).json({ error: 'Failed to fetch hurricane data.' });
        }
    });

    // Drought route
    router.get('/check-drought', async (req, res) => {
        const location = req.query.location;
        try {
            const weatherData = await getHurricaneData(location);
            const { current, location: locationData } = weatherData;
            const { precip_mm: rainfall, humidity, temp_c: temperature } = current;
            const { lat: latitude, lon: longitude } = locationData;

            const isDrought = rainfall < 2 && temperature > 35 && humidity < 30;

            io.emit('droughtUpdate', { location, isDrought });

            if (isDrought) {
                const mapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=10`;
                const htmlContent = `
                    <p>Alert: Drought conditions detected in ${location}. Rainfall: ${rainfall}mm, Humidity: ${humidity}%, Temperature: ${temperature}°C. Immediate action is required.</p>
                    <p>View the affected area on the map: <a href="${mapUrl}" target="_blank">OpenStreetMap</a></p>
                `;
                sendEmailAlert('gauravjio50@gmail.com', `Drought Alert: Drought detected in ${location}`, htmlContent);
            }

            res.json({ isDrought });
        } catch (error) {
            console.error('Error fetching drought data:', error);
            res.status(500).json({ error: 'Failed to fetch drought data.' });
        }
    });

    return router;
};