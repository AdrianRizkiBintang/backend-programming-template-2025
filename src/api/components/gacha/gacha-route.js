const express = require('express');
const gachaController = require('./gacha-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/gacha', route);

  // Endpoint Utama
  route.post('/play', gachaController.play);

  // Endpoint Bonus
  route.get('/history/:userId', gachaController.history);
  route.get('/prizes', gachaController.prizes);
  route.get('/winners', gachaController.winners);
};
