// src/routers/currentBalanceUsesRouter.js
const express = require('express');
const router = express.Router();
const currentBalanceUsesController = require('../controllers/currentBalanceUsesController');

// Define routes
router.get('/currentBalanceUses/', currentBalanceUsesController.getAllCurrentBalanceUses);
router.get('/currentBalanceUses/:id', currentBalanceUsesController.getCurrentBalanceUseById);
router.post('/currentBalanceUses/', currentBalanceUsesController.createCurrentBalanceUse);
router.put('/currentBalanceUses/:id', currentBalanceUsesController.updateCurrentBalanceUse);
router.delete('/currentBalanceUses/:id', currentBalanceUsesController.deleteCurrentBalanceUse);

module.exports = router;
