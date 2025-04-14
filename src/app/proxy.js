const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/geocode', async (req, res) => {
  const street = req.query.street;
  const city = req.query.city;
  const state = req.query.state;

  const url = `https://geocoding.geo.census.gov/geocoder/locations/address?street=${encodeURIComponent(
    street
  )}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(
    state
  )}&benchmark=2020&format=json`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});